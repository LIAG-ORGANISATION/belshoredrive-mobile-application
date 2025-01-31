import Prelude from "@prelude.so/sdk";

const client = new Prelude({
  apiToken: process.env.EXPO_PUBLIC_PRELUDE_API_KEY,
});

export const sendVerificationCode = async (phoneNumber: string) => {
  const verification = await client.verification.create({
    target: {
      type: "phone_number",
      value: phoneNumber,
    },
  });

  return verification.id;
};
