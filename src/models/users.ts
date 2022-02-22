import { ObjectType, Field, ID, Int } from 'type-graphql'
import {
  prop as Property,
  modelOptions,
  pre,
  getModelForClass,
  Severity
} from '@typegoose/typegoose'
import jwt from 'jsonwebtoken'
import { config } from '../config/envConfig'
import bcrypt from 'bcrypt'
import { VerificationStatus } from '../graphql/schema/Response'

@pre<userSchema>('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await this.hashPass(this.password)
  }

  next()
})
@ObjectType({ description: 'User schema' })
@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export class userSchema {
  @Field(() => ID)
  _id: string

  @Property({
    required: true
  })
  @Field()
  name: string

  @Property({
    required: true
  })
  @Field()
  email: string

  @Property({
    required: true
  })
  @Field()
  password: string

  @Property({
    required: true
  })
  @Field()
  phone_number: string

  @Property({
    required: true
  })
  @Field()
  country: string

  @Property({
    required: true,
    default: VerificationStatus.pending
  })
  @Field()
  verified: VerificationStatus

  async hashPass(password: string) {
    return await bcrypt.hash(password, 10)
  }

  async comparePass(password: string) {
    return await bcrypt.compare(password, this.password)
  }

  async generateToken() {
    return jwt.sign({ _id: this._id }, config.JWT_SECRET, {
      expiresIn: '1h'
    })
  }

  async verifyToken(token: string) {
    const { _id } = jwt.verify(token, config.JWT_SECRET) as any
    console.log(_id)
    return _id == this._id
  }
}

export const User = getModelForClass(userSchema, {
  schemaOptions: { timestamps: true, collection: 'users' }
})