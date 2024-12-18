import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";
import { auth } from "@/auth";

export async function GET() {
  await dbConnect();

  const session = await auth();
  const user: User = session?.user;
  if (!session || !session.user) {
    return Response.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }

  const userId = new mongoose.Types.ObjectId(user._id);

  try {
    const user = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);
    // It will return array

    if (!user || user.length === 0) {
      return Response.json(
        { message: "User does not have any messages yet.",messages: [], success: true },
        { status: 200 }
      );
    }

    return Response.json(
      { success: true, messages: user[0].messages },
      { status: 200 }
    );
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return Response.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
