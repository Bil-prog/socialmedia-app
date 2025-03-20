import { Link } from "react-router";
import { Post } from "./PostList";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, } from "../components/ui/card";
// import { useEffect, useState } from "react";
// import { supabase } from "../supabase-client";

interface Props {
  post: Post;
}

const PostItem = ({ post }: Props) => {
  console.log("Post data:", post);
  return (
    <div className="relative group">
      <div className="absolute -inset-1 rounded-[20px] bg-gradient-to-r from-pink-600 to-purple-600 blur-sm opacity-0 group-hover:opacity-50 transition duration-300 pointer-events-none" />
      <Card className="max-w-md overflow-hidden relative z-10">
        <CardHeader className="flex flex-row items-center gap-4 p-4">
          {post.avatar_url ? (
            <img
              src={post.avatar_url}
              alt="avatar"
              className="w-[35px] h-[35px] rounded-full object-cover"
            />
          ) : (
            <div className="w-[35px] h-[35px] rounded-full bg-gradient-to-tl from-[#8A2BE2] to-[#491f70]" />
          )}
          <div className="grid gap-1">
            <p className="text-sm font-medium leading-none text-white">{post.author}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(post.created_at).toLocaleDateString()}
            </p>
          </div>
        </CardHeader>
        <div className="relative h-48 w-full overflow-hidden">
          <img
            src={post.image_url}
            alt="Blog post cover image"
            className="object-cover transition-transform hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <CardContent className="p-4 pt-0 h-24">
          <h3 className="mb-2 text-xl font-bold tracking-tight">
            <Link to={`/post/${post.id}`} className="hover:underline">
              {post.title}
            </Link>
          </h3>
          <p className="text-sm text-white/70">
            {post.content.length > 100
              ? `${post.content.slice(0, 100)}...`
              : post.content}
          </p>
        </CardContent>
        <CardFooter className="flex items-center p-4 pt-0">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 px-2 text-[17px] cursor-pointer"
            >
              ❤️ <span className="text-xs">{post.like_count ?? 0}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 px-2 text-[17px] cursor-pointer"
            >
              💬 <span className="text-xs">{post.comment_count ?? 0}</span>
            </Button>
          </div>
          <div className="ml-auto">
            <span className="rounded-full bg-white/40 px-2 py-1 text-xs font-medium text-white">
              {post.community || "Regular"}
            </span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PostItem;
