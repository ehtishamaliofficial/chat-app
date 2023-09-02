import { genSalt, compare, hash } from 'bcryptjs';

export const hashed = async (password: string) => {
  try {
    const salt = await genSalt(10);
    return await hash(password, salt);
  } catch (error) {
    throw new Error(error);
  }
};

export const isMatch = async (password: string, hash: string) => {
  try {
    return await compare(password, hash);
  } catch (error) {
    throw new Error(error);
  }
};
