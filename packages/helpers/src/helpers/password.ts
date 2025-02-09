export function generatePassword(): string {
  const symbols = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let password = '';

  for (let i = 0; i < 9; i++) {
    password += symbols.charAt(Math.floor(Math.random() * symbols.length));
  }

  return password;
}
