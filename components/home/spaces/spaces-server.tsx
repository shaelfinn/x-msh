import { db } from "@/db/drizzle";
import { user } from "@/db/schema";
import { sql } from "drizzle-orm";
import { SpacesClient } from "./spaces-client";

export async function Spaces() {
  const randomUsers = await db
    .select({
      id: user.id,
      name: user.name,
      image: user.image,
    })
    .from(user)
    .orderBy(sql`RANDOM()`)
    .limit(18);

  return <SpacesClient users={randomUsers} />;
}
