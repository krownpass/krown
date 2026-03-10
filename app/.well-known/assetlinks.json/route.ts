export async function GET() {
    return Response.json([
        {
            relation: ["delegate_permission/common.handle_all_urls"],
            target: {
                namespace: "android_app",
                package_name: "com.krown.app",
                sha256_cert_fingerprints: [
                    process.env.ANDROID_SHA256_FINGERPRINT!,
                ],
            },
        },
    ]);
}
