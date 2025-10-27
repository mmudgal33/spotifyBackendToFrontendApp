const production = {
    url: 'https://spotifybackendtofrontendapp-1.onrender.com/callback',
    api: 'https://spotifybackendtofrontendapp.onrender.com'
    //api: 'https://mern-task-app-foodorderingfrontend1-api.onrender.com'
  };
  const development = {
    url: 'http://127.0.0.1:3000/callback',
    api: 'http://localhost:5000'
  };
  export const config = process.env.NODE_ENV === 'development' ? development : production;

 