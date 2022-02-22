import { IsEmail, Length } from "class-validator"
import { ArgsType, Field } from "type-graphql"
import { VerificationStatus } from "./Response"

@ArgsType()
export class createUserArgs {
  @Field()
  @Length(1, 255)
  name: string

  @Field()
  @IsEmail()
  email: string
  
  @Field()
  password: string

  @Field({ description: 'Phone number example format. ====>> "2348023456789".' })
  @Length(11, 13)
  phone_number: string

  @Field()
  country: string
}
