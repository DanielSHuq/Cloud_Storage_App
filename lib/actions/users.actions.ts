"use server";
import { createAdminClient } from "@/appwrite";
import { appwriteConfig } from "@/appwrite/config";
import { Query, ID } from "node-appwrite";
import { parseStringify } from "../utils";

const getUserByEmail = async (email: string) => {
  const { databases } = await createAdminClient();

  const result = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.usersCollectionId,
    [Query.equal("email", [email])]
  );
  return result.total > 0 ? result.documents[0] : null;
};

const handleError = (error: unknown, message: string) => {
  console.log(error, message);
  throw error;
};
const sendEmailOTP = async ({ email }: { email: string }) => {
  const { account } = await createAdminClient();

  try {
    const session = await account.createEmailToken(ID.unique(), email);

    return session.userId;
  } catch (err) {
    handleError(err, "Failed to create email token");
  }
};

export const createAccount = async ({
  fullName,
  email,
}: {
  fullName: string;
  email: string;
}) => {
  try {
    const existingUser = await getUserByEmail(email);
    const accountId = await sendEmailOTP({ email });

    if (!accountId) {
      throw new Error("Failed to generate account ID or send OTP.");
    }

    if (!existingUser) {
      const { databases } = await createAdminClient();

      await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        ID.unique(),
        {
          fullName,
          email,
          avatar:
            "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png",
          accountId,
        }
      );
    }

    return parseStringify({ accountId });
  } catch (error: unknown) {
    console.error("Error in createAccount:", error);
    throw new Error(`Account creation failed: ${error.message}`);
  }
};
