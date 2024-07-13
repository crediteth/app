import type { NextApiRequest, NextApiResponse } from 'next'

type ResponseData = {
    access_token: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    //TODO: restrict access

    // test credentials
    const clientId = "3c5f94b7-ade9-43ef-afff-bf0fa33f3127";
    const clientSecret = "tEaBp1X8Qc4Gk4UhM6XWfJKMTRNZQZw7rMZpvHJV955N5iWY824O8K8Umw2G9mVu";

    const authRes = await fetch('https://login.bisnode.com/sandbox/v1/token.oauth2', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            grant_type: "client_credentials",
            scope: "credit_data_companies"
        }),
    })

    if (!authRes.ok) {
        res.status(500).end();
        return;
    }

    const data = await authRes.json();
    const access_token = data.access_token;

    res.status(200).json({ access_token })
}