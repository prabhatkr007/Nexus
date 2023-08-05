# MERN Blog App

![MERN Blog App](https://i.imgur.com/iuCB5RZ.png)

## Introduction

Welcome to the MERN Blog App! This is a full-stack web application built using the MERN stack, which stands for MongoDB, Express.js, React.js, and Node.js. The app provides a platform for users to create, read, update, and delete blog posts. It also allows users to interact with each other by adding comments to blog posts.

## Features

- User Registration: Users can sign up for an account to access the full features of the blog app.
- User Authentication: Secure user authentication is implemented to ensure data privacy.
- Create Blog Posts: Authenticated users can create new blog posts with a title, content, and optional image.
- View Blog Posts: All users can view the list of blog posts on the home page.
- View Single Blog Post: Users can click on a blog post to view its full content along with comments.
- Update Blog Posts: Users can edit and update their own blog posts.
- Delete Blog Posts: Users can delete their own blog posts.
- Add Comments: Authenticated users can add comments to blog posts.
- Responsive Design: The app is designed to work seamlessly on desktops, tablets, and mobile devices.

## Technologies Used

- MongoDB: A NoSQL database used to store blog post and user data.
- Express.js: A backend web application framework for Node.js, providing a robust set of features for web and mobile applications.
- React.js: A popular JavaScript library for building user interfaces.
- Node.js: A server-side runtime environment for executing JavaScript code.

## Installation and Setup

1. Clone the repository: `git clone https://github.com/prabhatkr007/Blog-App.git`
2. Navigate to the project directory: `cd Blog-App`
3. Navigate to the server directory: `cd server`
4. Install server dependencies: `npm install`
5. Create a `config.env` file in the root directory of the server.
6. Inside the `config.env` file, add the following environment variables:

```
# MongoDB Connection URI
DATABASE=your_mongodb_connection_uri

# JWT Secret Key (for user authentication)
SECRET_KEY=your_jwt_secret_key

# Other Configuration Variables
PORT=4000
```

7. Start the development server: `npm start`
8. Go back to the project directory: `cd ..`
9. Navigate to the client directory: `cd client`
10. Install client dependencies: `npm install`
11. Start the client: `npm start`

Make sure you have Node.js and MongoDB installed on your machine.

## How to Use

1. Open your web browser and go to `http://localhost:3000` to access the app.
2. If you are a new user, click on the "Sign Up" link to create an account.
3. Once logged in, you can create new blog posts, view existing posts, update or delete your posts, and add comments to other posts.

## Future Improvements

- Implement user profile pages with additional user information.
- Add social media sharing capabilities for blog posts.
- Implement user roles (admin, regular user) with varying levels of access.
- Improve the user interface and user experience.



---
Remember to replace `PORT`, `your_mongodb_connection_uri`, and `your_jwt_secret_key` with the appropriate values for your project.

Thank you for using the MERN Blog App! We hope you find it useful for managing your blog posts and engaging with your audience. If you encounter any issues or have suggestions for improvement, please feel free to raise an issue or submit a pull request on the GitHub repository. Happy blogging!



