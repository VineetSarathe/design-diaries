import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { posts as fallbackPosts, type BlogPost } from "@/data/resources";
import { cmsToPosts, type CmsBlog } from "@/lib/cms-blog";

export function useBlogs(fallback: BlogPost[] = fallbackPosts) {
  const [posts, setPosts] = useState<BlogPost[]>(fallback);

  useEffect(() => {
    apiRequest<{ posts: CmsBlog[] }>("/blogs")
      .then((res) => {
        if (res.posts?.length) setPosts(cmsToPosts(res.posts));
      })
      .catch(() => undefined);
  }, []);

  return { posts };
}
