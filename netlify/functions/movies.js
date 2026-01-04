exports.handler = async (event, context) => {
  const API_KEY = process.env.VITE_TMDB_API_KEY;

  if (!API_KEY) {
    console.error("❌ Missing TMDB API Key");
    return { statusCode: 500, body: JSON.stringify({ error: "Missing TMDB API Key" }) };
  }

  const MOVIE_CONFIG = [
    { id: 83533, favorite: true, myRating: 9.5 }, 
    { id: 1287571, favorite: false, myRating: 9.0 }, 
    { id: 1061474, favorite: false, myRating: 8.5 },
    { id: 617126, favorite: false, myRating: 8.5 },
    { id: 1234821, favorite: false, myRating: 8.0 },
    { id: 986056, favorite: false, myRating: 8.0 },
    { id: 911430, favorite: false, myRating: 8.7 },
    { id: 822119, favorite: false, myRating: 7.8 },
    
    // Tahun 2024
    { id: 533535, favorite: true },
    { id: 912649, favorite: false },  
    { id: 939243, favorite: false },
    { id: 1175161, favorite: false },
    { id: 889737, favorite: false },

    // Tahun 2023
    { id: 447365, favorite: true }, 
    { id: 502356, favorite: false },
    { id: 569094, favorite: false },
    { id: 609681, favorite: false },
    { id: 667538, favorite: false },
    { id: 640146, favorite: false },
    { id: 572802, favorite: false },
    { id: 335977, favorite: false },
    { id: 298618, favorite: false },
    { id: 565770, favorite: false },

    // Tahun 2022
    { id: 76600, favorite: true }, 
    { id: 453395, favorite: false },
    { id: 505642, favorite: false },
    { id: 414906, favorite: false },
    { id: 616037, favorite: false },
    { id: 675353, favorite: false },
    { id: 436270, favorite: false },
    
    // Tahun 2021
    { id: 634649, favorite: true }, 
    { id: 580489, favorite: false },
    { id: 566525, favorite: false },
    { id: 524434, favorite: false },
    { id: 497698, favorite: false },
    { id: 436969, favorite: false },

    // Tahun 2020
    { id: 454626, favorite: true },
    { id: 464052, favorite: false },

    // Tahun 2019
    { id: 299534, favorite: true },
    { id: 429617, favorite: false },
    { id: 299537, favorite: false },
    { id: 475557, favorite: false },
    { id: 181812, favorite: false },
    { id: 287947, favorite: false },

    // Tahun 2018
    { id: 299536, favorite: true },
    { id: 284054, favorite: false },
    { id: 424694, favorite: false },
    { id: 297802, favorite: false },
    { id: 335983, favorite: false },
    { id: 363088, favorite: false },
    { id: 324857, favorite: false },
    { id: 424783, favorite: false },
    { id: 383498, favorite: false },
  ];

  try {
    const requests = MOVIE_CONFIG.map(movie => 
      fetch(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=${API_KEY}&language=en-US`)
        .then(res => res.json())
        .then(data => ({
            ...data,
            isFavorite: movie.favorite,
            myRating: movie.myRating
        }))
    );

    const results = await Promise.all(requests);    
    const validMovies = results.filter(movie => movie.title && !movie.status_message);

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
      body: JSON.stringify(validMovies),
    };

  } catch (error) {
    console.error("❌ TMDB Error:", error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};