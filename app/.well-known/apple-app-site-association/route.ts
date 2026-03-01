
export async function GET() {
    return Response.json({
        applinks: {
            details: [
                {
                    appIDs: [`${process.env.APPLE_TEAM_ID}.com.krown.app`],
                    components: [
                        { "/": "/event/*" },
                        { "/": "/cafe/*" },
                        { "/": "/invite/*" },
                    ],
                },
            ],
        },
    });
}
