import { ForbiddenError } from 'apollo-server-express'
import { Resolver, Mutation, Arg, Args, Query, UseMiddleware, Ctx } from 'type-graphql'
import { startSession } from 'mongoose'
import { User } from '../../models/users'
import { IResponse, VerificationStatus } from '../schema/Response'
import {
  createUserArgs,
} from '../schema/userArgs'
import { authChecker, MyContext } from '../../config/auth'
import { UserInputError } from 'apollo-server-core'
// import event from '../../events'
import { config } from '../../config/envConfig'
import { sendEmail } from '../../helpers/sendMail'

@Resolver()
export class UserResolver {
  @Mutation(() => IResponse)
  async createUser(@Args() data: createUserArgs): Promise<IResponse> {
    const { name, email, password, phone_number, country } = data
    const user = await User.findOne({ email })
    if (user) {
      throw new UserInputError('User already exists')
    }

    const newUser = await User.create({
      name,
      email,
      password,
      phone_number,
      country,
      verified: VerificationStatus.pending,
    })
    const token = await newUser.generateToken()
    await sendEmail(newUser.email, `Hi ${newUser.name} \nPlease click the following link to verify your account: \n${config.APP_URL}verify?token=${token} \nThanks,\nTeam Fidia`, 'Verify your email')

    return {
      success: true,
      message: 'User created successfully'
    }
  }

  @Mutation(() => IResponse)
  async verifyUser(@Arg('token') token: string): Promise<IResponse> {
    const session = await startSession()
    session.startTransaction()
    try {
      const user = await User.findOne({ verified: VerificationStatus.pending })
      if (!user) {
        return {
          success: true,
          message: 'User already verified',
        }
      }
      const verified = await user.verifyToken(token)
      if (!verified) {
        throw new ForbiddenError('Invalid token')
      }
      await user.updateOne({ verified: VerificationStatus.verified })
      await session.commitTransaction()
      return {
        success: true,
        message: 'User verified successfully'
      }
    } catch (error) {
      await session.abortTransaction()
      throw error
    }
  }

  @Mutation(() => IResponse)
  async resendVerificationEmail(@Arg('email') email: string): Promise<IResponse> {
    const user = await User.findOne({ email })
    if (!user) {
      throw new UserInputError('User does not exist')
    }
    if (user.verified === VerificationStatus.verified) {
      return {
        success: true,
        message: 'User is already verified'
      }
    }
    const token = await user.generateToken()
    await sendEmail(user.email, `Hi ${user.name} \nPlease click the following link to verify your account: \n${config.APP_URL}verify?token=${token} \nThanks,\nTeam Fidia`, 'Verify your email')
    return {
      success: true,
      message: 'Verification email resent successfully'
    }
  }

  @Mutation(() => IResponse)
  async login(@Arg('email') email: string, @Arg('password') password: string): Promise<IResponse> {
    const user = await User.findOne({ email })
    if (!user) {
      throw new ForbiddenError('Invalid email or password')
    }

    const isMatch = await user.comparePass(password)
    if (!isMatch) {
      throw new ForbiddenError('Invalid email or password')
    }

    if (user.verified === VerificationStatus.pending) {
      throw new ForbiddenError('Check your email to verify your account')
    }
    const token = await user.generateToken()
    return {
      success: true,
      message: 'User logged in successfully',
      token: token,
    }
  }


  @Query(() => IResponse)
  @UseMiddleware(authChecker)
  async getUsers(@Ctx() { payload }: MyContext): Promise<IResponse> {
    const users = await User.find({ _id: { $ne: payload.user_id } })
    return {
      success: true,
      message: 'Users fetched successfully',
      data: users
    }
  }
}
