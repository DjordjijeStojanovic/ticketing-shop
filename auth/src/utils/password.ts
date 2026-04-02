import { randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

const scriptToAsync = promisify(scrypt);

class Password {
    static async hashPass(password: string) {
        const salt = randomBytes(8).toString('hex');
        const buff = (await scriptToAsync(password, salt, 64)) as Buffer;
        return `${buff.toString('hex')}.${salt}`;
    }

    static async comparePass(password: string, passToCompare: string) {
        const [hashedPassword, salt] = password.split('.');
        const buf = (await scriptToAsync(passToCompare, salt, 64)) as Buffer;
        return buf.toString('hex') === hashedPassword;
    }
}

export { Password };