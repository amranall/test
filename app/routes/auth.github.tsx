import type { LoaderFunction } from '@remix-run/cloudflare';
import { redirect } from '@remix-run/cloudflare';
import { AuthSuccess } from '~/components/auth/AuthGithubSucess';

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return redirect('/');
  }

  return null;
};

export default function GitHubAuth() {
  return <AuthSuccess />;
}
