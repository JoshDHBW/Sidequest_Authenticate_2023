import Tokendata from "src/token/dto/tokenData";
import { User } from 'src/schemas/user.schema';
export default interface Loginresult extends Tokendata{
    success: boolean,
    user: User
}