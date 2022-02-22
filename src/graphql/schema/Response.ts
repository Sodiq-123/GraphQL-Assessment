import { userSchema } from '../../models/users'
import { ObjectType, Field } from 'type-graphql'

@ObjectType({ description: 'Generic status response' })
export class IResponse {
  @Field()
  success: boolean

  @Field()
  message: string

  @Field(() => [userSchema], { nullable: true })
  data?: userSchema[]
  
  @Field({ nullable: true })
  token?: string
}


export enum VerificationStatus {
  verified = 'verified',
  pending = 'pending',
}