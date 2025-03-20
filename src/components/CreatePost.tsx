import { ChangeEvent, useState } from "react";
import { supabase } from "../supabase-client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { Community, fetchCommunties } from "./CommunityList";
import { useNavigate } from "react-router";

interface PostInput {
  title: string;
  content: string;
  avatar_url: string | null;
  community_id?: number | null;
  author: string | null;
  community?: string | null;
}

const createPost = async (post: PostInput, imageFile: File) => {
  const filePath = `${post.title}-${Date.now()}-${imageFile.name}`;

  const { error: uploadError } = await supabase.storage
    .from("post-images")
    .upload(filePath, imageFile);

  if (uploadError) throw new Error(uploadError.message);

  const { data: publicURLData } = supabase.storage
    .from("post-images")
    .getPublicUrl(filePath);

  let communityName = null;
  if(post.community_id){
    const {data: communityData, error: communityError} = await supabase
    .from("communities")
    .select("name")
    .eq("id", post.community_id)
    .single();

    if(communityError) throw new Error(communityError.message);
    communityName = communityData?.name || null;
  }

  const { data, error } = await supabase
    .from("posts")
    .insert({ ...post, image_url: publicURLData.publicUrl, community: communityName });

  if (error) throw new Error(error.message);
  return data;
};

const CreatePost = () => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [communityId, setCommunityId] = useState<number | null>(null);

  const navigate = useNavigate();
  const {user} = useAuth();

  const {data: communities} = useQuery<Community[], Error>({
    queryKey: ["communities"],
    queryFn: fetchCommunties,
  })

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (data: { post: PostInput; imageFile: File }) => {
      return createPost(data.post, data.imageFile);
    },
    onSuccess:() => {
      navigate("/")
    }
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedFile) return;
    mutate({
      post: {
        title,
        content,
        avatar_url: user?.user_metadata.avatar_url || null,
        community_id: communityId,
        author: user?.user_metadata.full_name || null,
        community: null,
      },
      imageFile: selectedFile,
    });
  };

  const handleCommunityChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setCommunityId(value ? Number(value) : null);
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="px-6 md:max-w-2xl mx-auto space-y-4">
      <div>
        <div>
          <label htmlFor="image" className="block mb-2 font-medium">
            Upload Image
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full text-gray-200"
          />
        </div>
        <label htmlFor="title" className="block mb-2 font-medium">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-white/10 bg-transparent p-2 rounded"
          required
        />
      </div>
      <div>
        <label htmlFor="content" className="block mb-2 font-medium">
          Content
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={5}
          className="w-full border border-white/10 bg-transparent p-2 rounded"
          required
        ></textarea>
      </div>
      <div>
        <label className="block mb-2 font-medium">Select Community</label>
        <select id="community" onChange={handleCommunityChange} className="w-full border border-white/10 bg-black p-2 rounded">
          <option value={""}> -- Choose a Community --</option>
          {communities?.map((community, key) => (
            <option value={community.id} key={key}>
              {community.name}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="bg-purple-500 text-white px-4 py-2 rounded cursor-pointer"
      >
        {isPending ? "Creating..." : "Create Post"}
      </button>
      {isError && <p className="text-red-500">Error creating post</p>}
    </form>
  );
};

export default CreatePost;
