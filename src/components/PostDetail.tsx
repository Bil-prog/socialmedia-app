import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { Post } from "./PostList";
import LikeButton from "./LikeButton";
import CommentSection from "./CommentSection";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { UserRound } from "lucide-react";

interface Props {
  postId: number;
}

const fetchPostById = async (id: number): Promise<Post> => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data as Post;
};

const PostDetail = ({ postId }: Props) => {
  const { data, error, isLoading } = useQuery<Post, Error>({
    queryKey: ["post", postId],
    queryFn: () => fetchPostById(postId),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <div className="space-y-6">
      {data?.image_url && (
        <img src={data.image_url} alt={data?.title} className="rounded-lg mb-8 object-cover w-full h-[400px]"/>
      )}
      <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
        {data?.title}
      </h2>
      <div className="flex items-center gap-4">
        <Avatar>
          <AvatarImage src={data?.avatar_url} alt="avatar"/>
          <AvatarFallback><UserRound /></AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{data?.author}</p>
          <p className="text-gray-500 text-sm">{new Date(data!.created_at).toLocaleDateString()}</p>
        </div>
      </div>
      <p className="text-gray-400">{data?.content}</p>

      <LikeButton postId={postId}/>

      <hr className="my-8"/>

      <CommentSection postId={postId}/>
    </div>
  );
};

export default PostDetail;
