import type { NextPage } from 'next';
import { useRouter } from 'next/router'; // Corrected import
import { useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

const Success: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
	if (!router.isReady) return;

    const { session_id } = router.query;

    if (!session_id) {
      router.push('/').catch((err) => console.error(err));
    }
  }, [router]);
  return (
    <>
      <Head>
        <title>Subscription Successful - Artificiality</title>
      </Head>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full md:w-1/2 xl:w-1/3">
          <h1 className="text-3xl font-bold mb-4">Subscription Successful!</h1>
          <p className="text-gray-600 text-lg mb-6">
            Thank you for subscribing to Artificiality. You can now enjoy using our services to generate amazing images with Dall E 2.
          </p>
          <Link
            href="/art"
            className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200"
          >
            Start Generating Images
          </Link>
        </div>
      </div>
    </>
  );
};

export default Success;
