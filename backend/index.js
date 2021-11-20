import { Router } from 'itty-router'

const router = Router()

router.get("/", () => {
  return new Response("A simple API for the Cloudflare recruiting project!");
})

router.get("/posts", async request => {
	let posts = [];
	const entries = await POSTS.list();
	const keys = entries.keys;

	for (const key of keys) {
		posts.push(JSON.parse(await POSTS.get(key.name)));
	}

	return new Response(JSON.stringify(posts), {
    headers: {
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": "*"
		},
		status: 200
	});
})

router.post("/posts", async request => {
	if (!request.headers.get("Content-Type").includes("text/plain")) {
		return new Response("No JSON provided", { status: 400 });
	}

	let post;
	try {
	  post = await request.json();
	} catch (err) {
		return new Response("Invalid json provided", { status: 400 });
	}

  if (!post.id) {
		return new Response("Post has no title", { status: 400 });
	}
	if (!post.title) {
		return new Response("Post has no title", { status: 400 });
	}
	if (!post.name) {
		return new Response("Post has no username", { status: 400 });
	}
	if (!post.content) {
		return new Response("Post has no content", { status: 400 });
	}
	if (!post.date) {
		return new Response("Post has no date", { status: 400 });
  }
	
	if (Object.keys(post).length > 5) {
		return new Response("Post has extraneous fields", { status: 400 });
	}

	await POSTS.put(post.id, JSON.stringify(post));

	return new Response("success", { 
    headers: {
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": "*"
		},
		status: 200
	});
})

router.all("*", () => new Response("404, not found!", { status: 404 }))

addEventListener('fetch', (e) => {
  e.respondWith(router.handle(e.request))
})
