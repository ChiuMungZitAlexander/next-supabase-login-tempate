import * as jose from "jose";

export const validateAndRefreshToken = async (jwtToken: string) => {
  const verifyResult = await jose.jwtVerify<{ username: string }>(
    jwtToken,
    new TextEncoder().encode(process.env.JWT_SECRET_KEY!)
  );

  const newToken = await new jose.SignJWT({
    username: verifyResult.payload.username,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("30d")
    .sign(new TextEncoder().encode(process.env.JWT_SECRET_KEY!));

  return newToken;
};
