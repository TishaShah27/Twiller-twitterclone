import  { useEffect, useState } from "react";
import { useUserAuth } from "../context/UserAuthContext";
const useLoggedinuser = () => {
  const { user } = useUserAuth();
  const email = user?.email;
  const [loggedinuser, setloggedinuser] = useState({});

useEffect(() => {
  if (!email) return;
  fetch(`https://twiller-twitterclone-ku86.onrender.com/loggedinuser?email=${email}`)
    .then((res) => res.json())
    .then((data) => {
      setloggedinuser(data);
    });
}, [email]);

  return [loggedinuser, setloggedinuser];
};

export default useLoggedinuser;
