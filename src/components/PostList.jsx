import {useQuery,  useMutation} from "@tanstack/react-query";
import { fetchPosts,addPost,fetchTags } from "../api/api";


function PostList() {

const{data:postData,isLoading,isError,error} = useQuery({
    
    querykey :["posts"],//provides a unique key to each and every query so yhan we can identify it uniquely
    queryFn: fetchPosts,
  });

  const {mutate,isError:isPostError,isPending,error:postError ,reset } = useMutation({
    mutation:addPost,
    
}); //for adding new post

const {data:tagsData} = useQuery({
  queryKey:["tags"],
  queryFn:fetchTags,
})


const handleSubmit = (e) =>{
  e.PreventDefault();

  const formData = new FormData(e.target);
  const title = formData.get('title');
  const tags = Array.from(formData.keys()).filter(
    (key) => formData.get(key) === "on"
  );
  if (!title || !tags) return;

  mutate({id:postData.length+1,title,tags});

  e.target.reset();




};

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <input
        type="text"
        placeholder = "Enter your post..."
        className="postbox"
        name="title"
        />
        <div className="tags">
          {tagsData?.map((tag)=>{
            return (
              <div key={tag}>
                <input name={tag} id = {tag} type= "checkbox" />
                <label htmlFor={tag}>{tag}</label> 
              </div>
          
            );
          })}
        </div>
          <button>post</button>

      </form>
        {isLoading && <p>Loading ... </p>}
        {isError && <p>{error?.message}</p>}

        {postData?.map((post)=> {
            return (
                <div key ={post.id} className="post">
                    <div>{post.title}</div>

                    {post.tags.map((tag)=><span key = {tag}>{tag}</span>)}
                </div>
            )
        })}
    </div>
  )
}

export default PostList