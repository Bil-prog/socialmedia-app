import { useParams } from "react-router";
import PostDetail from "../components/PostDetail";

const PostPage = () => {
  const { id } = useParams<{ id: string }>();
  return (
    <div className="pt-20 container mx-auto px-4">
      <PostDetail postId={Number(id)} />
    </div>
  );
};

export default PostPage;
