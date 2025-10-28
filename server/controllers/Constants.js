const production = {
    url: 'https://spotifybackendtofrontendapp-1.onrender.com',
    api: 'https://spotifybackendtofrontendapp.onrender.com'
    //api: 'https://mern-task-app-foodorderingfrontend1-api.onrender.com'
  };
  const development = {
    url: 'http://127.0.0.1:3000',
    // api: 'http://127.0.0.1:5000'
    api: 'https://spotifybackendtofrontendapp.onrender.com'
  };
  export const config = process.env.NODE_ENV === 'development' ? development : production;
  // export const config = production;

 