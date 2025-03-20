import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabase-client";
import { BsHandThumbsDown, BsHandThumbsUp, BsFillHandThumbsUpFill, BsFillHandThumbsDownFill } from "react-icons/bs";

interface Props {
  postId: number;
}

interface Vote {
  id: number;
  post_id: number;
  user_id: string;
  vote: number;
}

const vote = async (voteValue: number, postId: number, userId: string) => {
  const { data: existingVote } = await supabase
    .from("votes")
    .select("*")
    .eq("post_id", postId)
    .eq("user_id", userId)
    .maybeSingle();

  if (existingVote) {
    if (existingVote.vote === voteValue) {
      const { error } = await supabase
        .from("votes")
        .delete()
        .eq("id", existingVote.id);

      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabase
        .from("votes")
        .update({ vote: voteValue })
        .eq("id", existingVote.id);

      if (error) throw new Error(error.message);
    }
  } else {
    const { error } = await supabase
      .from("votes")
      .insert({ post_id: postId, user_id: userId, vote: voteValue });
    if (error) throw new Error(error.message);
  }
};

const fetchVotes = async (postId: number): Promise<Vote[]> => {
  const { data, error } = await supabase
    .from("votes")
    .select("*")
    .eq("post_id", postId);

  if (error) throw new Error(error.message);
  return data as Vote[];
};

const LikeButton = ({ postId }: Props) => {
  const { user } = useAuth();

  const queryClient = useQueryClient();

  const {
    data: votes,
    isLoading,
    error,
  } = useQuery<Vote[], Error>({
    queryKey: ["votes", postId],
    queryFn: () => fetchVotes(postId),
    refetchInterval: 5000,
  });

  const { mutate } = useMutation({
    mutationFn: (voteValue: number) => {
      if (!user) throw new Error("You must be logged in to Vote!");
      return vote(voteValue, postId, user.id);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["votes", postId] });
    },
  });

  if (isLoading) {
    return <div> Loading votes...</div>;
  }

  if (error) {
    return <div> Error: {error.message}</div>;
  }

  const likes = votes?.filter((v) => v.vote === 1).length || 0;
  const dislikes = votes?.filter((v) => v.vote === -1).length || 0;
  const userVote = votes?.find((v) => v.user_id === user?.id)?.vote;

  return (
    <div className="flex gap-0.5 items-center text-black">
      <button
        onClick={() => mutate(1)}
        className="px-3 py-1 cursor-pointer rounded transition-colors duration-150 flex items-center gap-1 text-black bg-white/90 rounded-l-full">
        {userVote === 1 ? (<BsFillHandThumbsUpFill className="mr-1 h-4 w-4" />) : (<BsHandThumbsUp className="mr-1 h-4 w-4"/>)}
        <span>{likes}</span>
      </button>
      
      <button
        onClick={() => mutate(-1)}
        className="px-3 py-1 cursor-pointer rounded transition-colors duration-150 flex items-center gap-1 text-black bg-white/90 rounded-r-full">
        {userVote === -1 ? (<BsFillHandThumbsDownFill className="mr-1 h-4 w-4" />) : (<BsHandThumbsDown className="mr-1 h-4 w-4"/>)}
        <span>{dislikes}</span>
      </button>
    </div>
  );
};

export default LikeButton;
