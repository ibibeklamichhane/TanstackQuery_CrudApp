import {useQuery,  useMutation,useQueryClient} from "@tanstack/react-query";
import { fetchPosts,addPost,fetchTags } from "../api/api";
import { useState } from "react";


function PostList() {

  const [page, setPage] = useState(1);

const{data:postData,isLoading,isError,error} = useQuery({
    
  queryKey: ["posts", page],//provides a unique key to each and every query so yhan we can identify it uniquely
    queryFn: () =>  fetchPosts(page), // data function that returns a promise 
  });

  const queryClient = useQueryClient()
  const {mutate,  
    isError:isPostError,
    isPending,
    error:postError ,
    reset,

   } = useMutation({
    mutationFn:addPost,
    
    
    //page is passed as props

    //-------on mutate runs before the actual mutation happens--------------
    //--------and on success runs after the mutation has happen -------------------


 /*   onMutate: () => {
      return {id:1}

    },
*/

    //----- Note that the `onSuccess` fn will be called once the mutation is in its 'success' state. However, this does NOT ------
    // ------On success, the cache will automatically update because of our `keepInvalid` option.-------




    onSuccess: (data,variable,context) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({
        querykey :["posts"],
       });
    },

    
}); //for adding new post

const {data:tagsData} = useQuery({
  queryKey:["tags"],
  queryFn:fetchTags,
})


const handleSubmit = (e) =>{
  e.preventDefault();

  const formData = new FormData(e.target);
  const title = formData.get('title');
  const tags = Array.from(formData.keys()).filter(
    (key) => formData.get(key) === "on"
  );
if (!title || !tags) return;
  
mutate({id:postData?.data?.length+1,title,tags}); //title,tags .. are the variables we provided 

e.target.reset()




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
                <input name={tag} id={tag} type= "checkbox" />
                <label htmlFor={tag}>{tag}</label> 
              </div>
          
            );
          })}
        </div>
          <button>post</button>

      </form>
        {isLoading && <p>Loading ... </p>}
        {isError && <p>{error?.message}</p>}

        <div className="pages">
        <button
          onClick={() => setPage((old) => Math.max(old - 1, 1))}
          disabled={page === 1}
        >
          Previous Page
        </button>

        <span>{page}</span>

        <button
          onClick={() => setPage((old) => old + 1)}
          disabled={!postData?.next}
        >
  Next Page
</button>
</div>

        {postData?.data?.map((post)=> {
            return (
                <div key ={post?.id} className="post">
                    <div>{post?.title}</div>

                    {post?.tags?.map((tag)=><span key = {tag}>{tag}</span>)}
                </div>
            )
        })}
    </div>
    
  )
}

export default PostList