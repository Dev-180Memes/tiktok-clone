import type { NextApiRequest, NextApiResponse } from "next";

import { searchPostsQuery } from "@/utils/queries";
import { client } from "@/utils/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        const { id } = req.query;
        const idValue = Array.isArray(id) ? id[0] : id || '';

        const videosQuery = searchPostsQuery(idValue);

        const videos = await client.fetch(videosQuery);

        res.status(200).json(videos);
    }
}