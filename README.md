# Furever Homes 🏡🐶

A Pet Adoption & Shelter Management Application

## GitHub Repository Links

| Repository | Link |
|------------|------|
| Furever Homes - Organisation Page | [https://github.com/Furever-Homes](https://github.com/Furever-Homes) |
| Furever Homes - Full Stack Application | [https://github.com/Furever-Homes/T3A2-Part-B](https://github.com/Furever-Homes/T3A2-Part-B) |
| Furever Homes - Deployed Frontend Website | [https://fureverhomes.netlify.app/](https://fureverhomes.netlify.app/) |
| Furever Homes - Deployed API Web Application | [https://fureverhomes.onrender.com](https://fureverhomes.onrender.com) |

*NOTE: Due to limitations of render (free version), please allow approximately 1 min after first API call for server to warm up*

## Contents

1) [What is "Furever Homes"?](#what-is-furever-homes)
2) [Meet The Furever Homes Team](#meet-the-furever-homes-team)
3) [Tech Stack](#tech-stack)
4) [Dependencies](#dependencies)
5) [Local Client Installation](#local-client-installation)
6) [Local Server Installation](#local-server-installation)
7) [Dataflow Diagram](#dataflow-diagram)
8) [Application Architecture Diagram](#application-architecture-diagram)
9) [User Stories](#user-stories)
10) [Wireframes](#wireframes)
11) [Project Management: Jira](#project-management-jira)
12) [Testing](#testing)

## What is "Furever Homes"?

Furever homes is a platform which is designed to provide a simple and easy pet adoption experience, while also delivering a way for animal shelters to manage their operations efficiently.

The application includes features such as:

- Pet search functionality
- Ability for adopters to shortlist pets into a 'favourites' section
- Application processes (Submit, Approve, Reject)
- Pet Data Management (CRUD)
- Secure user registration & login using JWT Authentication

## Meet The Furever Homes Team

- **Hendric Widjaja** - Backend Dev
- **Jess Lee** - Backend Dev
- **Jesse Prpic** - Frontend Dev
- **Melissa Duncan** - Frontend Dev

Throughout the project, tasks were distributed among team members based on their expertise in either frontend or backend development. We collectively decided to split the team evenly, with two members focusing on frontend and two on backend. Fortunately, everyone was aligned with their roles, and no disputes arose regarding task allocation. Once divided, we delegated responsibilities evenly, following our Jira management board, with a strong focus on adhering to the project timeline.

Hendric and Jess took charge of backend development, handling the database structure, API development, authentication processes, and application logic using Node.js, Express, and MongoDB. Meanwhile, Jesse and Melissa focused on the frontend, crafting an intuitive user interface by developing React components, implementing styling, and integrating API calls.

Effective communication was key to ensuring that both the frontend and backend remained in sync throughout development. By maintaining clear collaboration and regular check-ins, we successfully integrated all aspects of the project, resulting in a fully functional pet adoption platform.

## Tech Stack

<div align="center">
    <img src="https://img.shields.io/badge/-CSS-1572B6?style=flat-square&logo=css3&logoColor=white" height=30>
    <img src="https://img.shields.io/badge/-JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black" height=30>
    <img src="https://img.shields.io/badge/-React-61DAFB?style=flat-square&logo=react&logoColor=black" height=30>
    <img src="https://img.shields.io/badge/-Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white" height=30>
    <img src="https://img.shields.io/badge/-Express-000000?style=flat-square&logo=express&logoColor=white" height=30>
    <img src="https://img.shields.io/badge/-MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white" height=30>
</div>  

<br>

**CSS**: Provides styling and accomodates for a responsive web application / user interace.  
**JavaScript**: A flexible programming language which is utilised for both the frontend and backend logic of the application.  
**React**: A JavaScript library which allows developers to create dynamic web applications by utilising a component-based architecture.  
**Node.js**: A JavaScript runtime environment which allows JavaScript to run on the server.  
**Express**: A backend framework for Node.js which manages API requests, middleware & route handling.  
**MongoDB**: A NoSQL database solution that stores data in a JSON-like format.

## Dependencies

### Frontend Dependencies

- axios: Used to make HTTP requests from the frontend to fetch the pet data, submit applications and manage authentication.
- jwt-decode: To decode JSON Web Tokens (JWT) to extract user information (e.g., checking if a user is an admin)
- react: The main library for building the UI components in a in re way
- react-dom: Provided the DOM-specific methods that were used to render React components in the browser
- react-router-dom: Enabled us to utilise navigation between different pages using routes (e.g., /explore, /profile, /admin).

### Backend Dependencies

- bcrypt: We used this for hashing and verifying the user passwords securely
- cloudinary: This handled the image uploads and storage for the pet photos
- cors: Enabled the Cross-Origin Resource Sharing, which made it possible for the frontend to communicate with the backend on a different domain.
- dotenv: This managed environment variables (e.g., database connection strings, API keys)
- express: This is the core framework for building the whole backend API
- helmet: Used to mplement headers to prevent common web vulnerabilities
- joi: Validates incoming data (e.g., ensuring valid email formats in user registration)
- jsonwebtoken: Used to create and verify JSON Web Tokens (JWT) for the user authentication
- mongoose: Connects to MongoDB and defines the schemas for users, pets and applications
- multer: Handled the file uploads, used to store pet images
- multer-storage-cloudinary: This was used to integrate Multer with Cloudinary for seamless image uploads

### Backend Dev Dependencies

- jest: We used this testing framework for running automated tests
- mongodb-memory-server: Used to create an in-memory MongoDB instance for testing without actually modifying real data
- supertest: Allowed us to test API endpoints by sending HTTP requests and verifying responses

## Local Client Installation

### Necessary Account Creation

- **MongoDB** - [https://account.mongodb.com/account/register](https://account.mongodb.com/account/register)
- **Cloudinary** - [https://cloudinary.com/users/register_free](https://cloudinary.com/users/register_free)

    - Once you have created your account, drop and drag the images below (assets folder) into the assets section of your Cloudinary account. You may also feel free to use your own default images.
        - Default Cat: [src/client/src/assets/default_cat.jpg](src/client/src/assets/default_cat.jpg)
        - Default Dog: [src/client/src/assets/default_dog.jpg](src/client/src/assets/default_dog.jpg)
        - Default Other: [src/client/src/assets/default_other.jpg](src/client/src/assets/default_other.jpg)
        - Default User: [src/client/src/assets/default_user.jpg](src/client/src/assets/default_user.jpg)
    - Copy the URL for each corresponding default image to the necessary environment variables

### STEP 1: Clone the repository (client)

```bash
git clone git@github.com:Furever-Homes/T3A2-Part-B.git
cd T3A2-Part-B/src/client
```

### STEP 2: Install client dependencies

```bash
npm install
```

### STEP 3: Create `.env` file in src/client

```sh
# ROUTE / DOMAIN FOR CONNECTING TO LOCALLY HOSTED BACKEND
VITE_BACKEND_URL=http://localhost:5001

# DEFAULT USER IMAGE FROM CLOUDINARY
VITE_CLOUDINARY_DEFAULT_USER=insert_cloudinary_URL_for_default_user_image

# NOTE: "VITE_CLOUDINARY_DEFAULT_USER" value must be the same as CLOUDINARY_DEFAULT_USER value in server .env
```

Note: An .env.example file has been provided in this repository for clarity

### STEP 4: Start local client

```bash
npm start
```

## Local Server Installation

### STEP 1: Clone the repository (backend)

```bash
git clone git@github.com:Furever-Homes/T3A2-Part-B.git
cd T3A2-Part-B/src/server
```

### STEP 2: Install server dependencies

```bash
npm install
```

### STEP 3: Create `.env` file in src/server

```sh
# PORT selection (must match port selection used for frontend connection to backend URL)
PORT=5001

# Database URL for Mongo DB Atlas (must create an account)
DATABASE_URL=insert_database_URL_for_mongodb_atlas

# Password for test users in seeding.js
PASSWORD=insert_password_for_test_users_for_seeding

# JWT Secret for password hashing (bcrypt)
JWT_SECRET=insert_JWT_secret_for_password_hashing

# Cloudinary Environment Variables
CLOUDINARY_CLOUD_NAME=INSERT_CLOUDINARY_CLOUDNAME
CLOUDINARY_API_KEY=INSERT_CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET=INSERT_CLOUDINARY_API_SECRET
CLOUDINARY_DEFAULT_DOG=INSERT_CLOUDINARY_URL_for_default_dog_image
CLOUDINARY_DEFAULT_CAT=INSERT_CLOUDINARY_URL_for_default_cat_image
CLOUDINARY_DEFAULT_OTHER=INSERT_CLOUDINARY_URL_for_default_other_image
CLOUDINARY_DEFAULT_USER=INSERT_CLOUDINARY_URL_for_default_user_image

# NOTE: "CLOUDINARY_DEFAULT_USER" value must be the same as VITE_CLOUDINARY_DEFAULT_USER value in client .env
```

Note: An .env.example file has been provided in this repository for clarity

### STEP 4: Seed Database

```bash
# Inserts test data into the database
npm run seed
```

### STEP 5: Start local server

```bash
npm start
```

### DATABASE COMMANDS

```bash
# Dropping Database
npm run db:drop
```

```bash
# Seeding Database
npm run seed
```

### DEPLOYED TEST ENVIRONMENT: Data from - `npm run seed`

This data is for test usage only for [https://fureverhomes.netlify.app/](https://fureverhomes.netlify.app/)

| Name | Email | Password | Admin | Favourites | Applications |
|------|-------|----------|-------|------------|--------------|
| John Doe | johndoe@example.com | abc123 | FALSE | Buddy, Charlie | Buddy, Oscar
| Jane Smith | janesmith@example.com | abc123 | FALSE | Mittens, Max | Mittens, Daisy |
| Alex Brown | alexbrown@example.com | abc123 | FALSE | Luna, Oscar | Luna |
| Admin user | admin@example.com | abc123 | True | N/A | N/A |

### LOCAL TEST ENVIRONMENT: Data from - `npm run seed`

| Name | Email | Password | Admin | Favourites | Applications |
|------|-------|----------|-------|------------|--------------|
| John Doe | johndoe@example.com | [As noted in PASSWORD environment variable](#step-3-create-env-file-in-srcserver) | FALSE | Buddy, Charlie | Buddy, Oscar
| Jane Smith | janesmith@example.com | [As noted in PASSWORD environment variable](#step-3-create-env-file-in-srcserver) | FALSE | Mittens, Max | Mittens, Daisy |
| Alex Brown | alexbrown@example.com | [As noted in PASSWORD environment variable](#step-3-create-env-file-in-srcserver) | FALSE | Luna, Oscar | Luna |
| Admin user | admin@example.com | [As noted in PASSWORD environment variable](#step-3-create-env-file-in-srcserver) | True | N/A | N/A |

## Dataflow Diagram

The "Furever Homes" platform allows users to browse, favourite, and apply for pet adoptions. The system consists of three main collections (Users, Pets, and Applications). The Data Flow Diagram (DFD) follows standard conventions, clearly illustrating how data is created, stored, and transferred between users and the system.

1. User Interaction with User Database
    - Users can register and log in securely using JWT authentication. The Users database stores user profile details, security details and roles (pet adopter or shelter admin).

2. Pet Browsing and Favouriting
    - Adopters can search and filter pets based on criteria such as breed, age, activity level & health status. Pet data is fetched from the Pets database and displayed to users. Adopters can favourite pets, which is stored as a reference in the Users collection.

3. Adoption Application Process
    - Adopters can submit an application for adopting a pet, linking their user ID to the pet’s ID. The application is stored in the Applications database with a status of "submitted". Shelter admins can review applications, then either approve or reject them. If approved, the pet's status is updated to "adopted" in the Pets database.

4. Secure Data Management
    - All user authentication processes are handled securely using JWT tokens. Data is only accessible based on user roles:
        - Guest users can only view pets.
        - Adopters can only view and apply for pets.
        - Shelter admins can manage pet listings and review applications.

The DFD visually represents these processes, showing the flow of data between users, databases, and the application logic. It ensures a structured and clear depiction of how data is managed, stored, and accessed throughout the system.

### Dataflow Diagram - Context Diagram

![Context Diagram](<docs/dataflow_diagram/DFD Context Diagram.png>)

### Dataflow Diagram - Mid Level

![DFD - Mid Level](<docs/dataflow_diagram/DFD Mid Level.png>)

## Application Architecture Diagram

The Application Architecture Diagram is designed to provide a visual representation of Furever Homes system structure to understand how each layer of our application interact with each other. It defines each system component, illustrating the dataflow process from the frontend, to backend and to the database.

1. **Presentation Layer**  
This layer handles user interactions and renders the entire user interface. It includes all React components, UI elements, and client-side logic that is responsible for displaying all pet listings, user profiles, and adoption forms. Utilising React.js, the frontend communicates with the backend through API requests and manages the application state which provide a seamless user experience.

2. **Business Logic Layer**  
This Business Logic Layer contains the core application logic, business rules, and processing workflows. The Node.js & Express.js backend acts as an intermediary between the frontend and the database, which manages components such as:

    - API controllers that handle all API requests from the frontend related to pets, users, and adoptions.
    - All business logic for features such as checking pet availability, authenticating users and adoption request validiation checks are all encapsulated into services.
    - Middleware that manages authentication utilising JWT verification, logins and error handling.

3. **Data Access Layer (Database - MongoDB & Mongoose)**  
This layer purpose is to ensure persistent and accurate data retrieval. The MongoDB database stores structured information about pets, users, and adoption processes, while the Mongoose ORM facilitates interactions with the database by defining schemas and executing queries. This ensures efficient data storage, retrieval, and updates while maintaining consistency and integrity.

By structuring the application into these three layers, we ensure modularity, maintainability, and scalability, making it easier to manage and expand our pet adoption platform with future updates.

![Application Architecture Diagram](docs/app_arch_diagram/Application_architecture_diagram.jpg)

## User Stories

### Persona 1

**Who**: Pet Adopter/Explorer  
**What**: Want to browse pets with images and information about each of them (breed, age, activity level, health status)  
**Why**: To explore potential pets that fit in with my lifestyle and preferences before making a decision

**REFINEMENT**: Initially lacked filtering options, but was overwhelming. Refined to have a filtering option (pet type, age, activity level, breed) to help users narrow their search and find the most suitable pets faster

### Persona 2

**Who**: The Serious Pet Adopter  
**What**: Want to submit an adoption application  
**Why**: In order to express interest in a particular pet and give necessary details to the shelter

**REFINEMENT**: Applications initially involved only basic information but were refined to include personalised questions such as experience, home environment, other pets to help admins make better decisions

### Persona 3

**Who**: The Planner Pet Adopter  
**What**: Want to save pets to a shortlist of favourites  
**Why**: To be able to revisit the pets I'm interested in and be able to consider how they can fit into my life before committing immediately

**REFINEMENT**: Initially users could favourite pets, but there was no way to access their saved list, but a favourites section was added where users can view their saved pets

### Persona 4

**Who**: Shelter Admin - Decision Maker  
**What**: Need to review adoption applications for people looking to adopt pets  
**Why**: To ensure we match pets with suitable homes, which are responsible and prepared to host

**REFINEMENT**: Sorting applications allocated to particular pets to group applications by pet, making it easier to compare applicants and make sure each pet goes to the best home

### Persona 5

**Who**: Shelter Admin - The Caretaker  
**What**: Need to add new pets to the system  
**Why**: To allow people to browse and apply for pets

**REFINEMENT**: Inclusion of images as well as descriptions that include breed and health details and availablity status. Pets now have the status (available, considering applicants, adopted) on their profiles to provide more transparency to adopters

## Wireframes

The wireframes should clearly illustrate the user journey through the web application, ensuring smooth transitions between screens. A well-structured, logical flow is essential to guide users intuitively and efficiently through the app.

In the Furever Homes web application, users will transition effortlessly from one screen to another, with seamless interactions that feel natural. The wireframes should clearly indicate how each screen is connected, whether through actions like clicking buttons, submitting forms, or selecting a pet to view more details.

The design balances space thoughtfully, avoiding layouts that feel cramped or overly spacious. This careful distribution of space is crucial for creating an interface that is both user-friendly and visually appealing, helping users navigate the app without feeling overwhelmed.

Consistent layout is maintained across pages, with a header and footer for easy navigation. Sections are clearly defined, with distinct categories such as pets, the application list, and other features. This results in a clean, organized design that highlights key areas without overwhelming the user with clutter.

Visual hierarchy principles have been applied to improve user interaction. Key actions, such as "Adopt Now" and "Submit Application," are emphasized through bold fonts and contrasting colors. Important sections, like pet profiles and the application list, are centrally placed to naturally guide users to the most relevant content.

Icons and labels are used to make each button’s purpose clear. For example, the Home button displays a house icon and the "Home" label, the favourites button uses a paw print icon, and the Profile button shows a silhouette of a head. These visual cues make it easy for users to understand what each button does.

To enhance usability, subtle white space around buttons and input fields makes them more inviting and easier to interact with, creating a clean and accessible interface.

The wireframes also demonstrate the connections between different screens and features. A navigation bar, present on every page, allows users to easily switch between sections like Home, Favourites, Applications, and Profile.

Key interactions include the ability to favourite a pet by clicking the paw print icon, view detailed pet profiles, or track application status. The title bar on each screen provides a quick link back to the Home page for smooth navigation.

Each button serves a distinct function: for example, the "Exit Profile" button takes users back to the pet list, while the "Submit Application" button leads to an application confirmation screen. Shelter admins will use buttons like "Approve" or "Reject" to update a pet’s adoption status. The wireframe clearly shows how each button and form links to other screens, ensuring a fluid, logical navigation flow for both users and admins.

Throughout this process, we've developed both lo-fi and hi-fi wireframes. The lo-fi wireframes outline the basic structure and flow of the web application, while the hi-fi wireframes showcase visual elements, such as icons, buttons, and background designs. We've also created separate wireframes for mobile and desktop versions, ensuring the interface adapts to different devices. Depending on the screen size and resolution, elements and their arrangements may adjust to provide an optimal experience across devices.

## Lo-Fi Wireframes

![Destop - Whole Journey](docs/wireframe_images/(Desktop)%20Furever%20Homes%20-%20Lo%20Fi%20-%20User%20Journey.png)
![Mobile - User Journey](docs/wireframe_images/(Mobile)%20Furever%20Homes%20-%20Lo%20Fi%20-%20User%20Journey.png)
![Mobile - Shelter Journey](docs/wireframe_images/(Mobile)%20Furever%20Homes%20-%20Lo%20Fi%20-%20Shelter.png)

[Lo-Fi Wireframes - individual images of each wireframe](docs/wireframe_images/Furever%20Homes%20-%20Lo%20Fi%20-%20Individual%20Screenshot.pdf)

## Hi-Fi Wireframes

![Destop - Whole Journey](docs/wireframe_images/(Desktop)%20Furever%20Homes%20-%20Hi%20Fi%20-%20User%20Journey.png)
![Mobile - User Journey](docs/wireframe_images/(Mobile)%20Furever%20Homes%20-%20Hi%20Fi%20-%20User%20Journey.png)
![Mobile - Shelter Journey](docs/wireframe_images/(Mobile)%20Furever%20Homes%20-%20Hi%20Fi%20-%20Shelter.png)

[Hi-Fi Wireframes - individual images of each wireframe](docs/wireframe_images/Furever%20Homes%20-%20Hi%20Fi%20-%20Individual%20Screenshot.pdf)

## Project Management: Jira

The planning methodology for this project will utilise a software product developed by Atlassian called Jira. This project management tool allows for the easy execution of the agile 'scrum' framework. This will involve applying the following concepts:

### Epics, Stories, Tasks

![Epics, Stories & Tasks](docs/Jira/examples/epic_story_task.png)  

When tackling a large and difficult project, it is important to be able to breakdown the work into smaller, bite-sized tasks. When implementing an agile scrum framework, these smaller tasks are often referred to as issues, and can then be categorised into epics, stories and subtasks. This structure similarly mimics the methodology of creating long **(project)**, medium **(epic)** and short-term **(stories)** goals respectively.  

**Subtask**: An actionable item which can generally be completed within 1-3 days. A group of relatable tasks will form a user story.

**Story**: Involves capturing user invoked requests and feedback or are created by program managers. Once these stories are approved for action, they are compiled together to form epics. Stories are usually in the form of a request which starts with a persona, followed by a request, and ends with a reason.  

**Epic**: A compilation of stories which work towards a specific aspect or feature of an application.

### Issue Labels

Each issue within the Jira Project will contain an appropriate label to ensure a clear and cohesive team understanding of each task. The applicable labels will include:

- **Frontend**: Issues related to styling or client-side logic
- **Backend**: Issues related to APIs, database interactions or server-side logic
- **Design**: Issues related to UX/UI
- **Documentation**: Task related to updating or writing documentation
- **Bug**: Issues related to a component that requires fixing
- **Enhancement**: Tasks which are an addition / improvement to an existing feature
- **Testing**: Tasks related to confirming a created component or requirement of the application works as intended
- **High / Medium / Low Priority**: Categorise issues based on urgency

![Issue labels](docs/Jira/examples/issue_labels.png)  

### Task Assigning

Each issue within the Jira project is to be assigned to a single team member who will be responsible for its completion. This provides a clear delineation of tasks and enhances team coordination.

![Task Assignment](docs/Jira/examples/Assignment.png)

### Story Points & Sprint Velocity

Each issue within the Jira project will be assigned an amount of story points. The amount of points given to each issue will correlate to factors such as the amount of effort required, time required, task complexity & task uncertainty. This Jira project will follow the below matrix ([Motion Blog, 2023](https://www.usemotion.com/blog/agile-story-points)) to provide a cohesive understanding of task complexity between team members.

![Jira Story Points Matrix](docs/Jira/examples/jira_story_point_matrix.png)  

**Sprint Velocity** refers to the amount of story points that can be completed by a team within a single sprint. This metric provides the ability for a team to understand what is achievable within a sprint and integrate continuous improvement into their scrum framework. The team will assess this metric after every sprint and provide valuable insights for the next sprint planning session.

### Product Backlogs, Sprints & Standups

A **product backlog** is formed by breaking down and categorising all the tasks of the project. Once a backlog is formed, sprint planning, execution and retrospectives can be conducted.

**Sprint Planning**: Involves a team meeting where a discussion is held to determine the tasks from the backlog that will be included in the next sprint. Other components which are determined upon include sprint timeframe, task assignment and overall sprint goals.

**Sprints**: A sprint is a team-focussed period of approximately 2-4 weeks, where each team member is assigned a certain amount of tasks which can reasonably be completed within the chosen timeframe. This will allow for better team collaboration and completion of the project in a timely manner. **Daily standups** are also to be held throughout the sprint. These involve short meetings which help the team discuss pain points, collaborate for better solutions and update the sprint backlog/tasks if required.

![Project Backlog](docs/Jira/examples/Sprint_backlog.png)

### Kanban Board

Jira also provides an integrated kanban board which allows a team to visually undestand task progression and ensure workflow efficiency. The progression of a task can fall under to do, in progress, testing or done.

![Workflow Progress Example](docs/Jira/examples/kanban_board_eg.png)

- **To Do**: A task or issue which has not been started
- **In Progress**: A task or issue which has been started, but not yet completed
- **Done**: A task which has been completed and tested with a success result/s

By following the agile scrum framework, our team completed the below:

- **28th Jan 2025**: 1st Introduction / Brainstorm Meeting
- **30th Jan 2025**: 1st Sprint Planning Session (Sprint 1)
- **1st Feb 2025**: Finalise Sprint Planning (Sprint 1)
- **5th Feb 2025**: 1st Stand Up - Working on drafts for each assignment component
- **7th Feb 2025**: 2nd Stand Up - Continue working on drafts and group discussion / brainstorming
- **11th Feb 2025**: 3rd Stand Up - Conduct Project Team review of final drafts
- **13th Feb 2025**: 4th Stand Up - Review final documentation
- **16th Feb 2025**: 5th Stand Up - Final checks & submission

#### Part B Meetings

- **18th Feb 2025**: 1st Standup, Group Meeting - roughly allocating tasks, splitting frontend and backend work
- **20th Feb 2025**: 3rd Sprint Planning session (Sprint 3)
- **24th Feb 2025**: 2nd Stand up - update and progress checks. Start creating models and frontend homepage
- **27th Feb 2025**: 3rd Stand up - Initiated working on routes, controllers and middlewares for backend. Creating Explore and Pets page.
- **1st Mar 2025**: 4th Sprint Planning Session (Sprint 4)
- **4th Mar 2025**: 4th Stand up - Finalising main body of application
- **6th Mar 2025**: 5th Stand up - Testing backend logic with JEST, finalising front end design
- **11th Mar 2025**: 6th Stand up - Testing front end
- **13th Mar 2025**: 7th Stand up - Presentation of application, Deployment and submission

#### Example of Jira Sprint 3 task with child issues completed

![Sprint 3 example screenshot](docs/Jira/Sprint%203%20task%20example.png)

### Screenshot Examples of Task progression throughout Part A Timeline

#### 30th January 2025

![Epic 30th Jan](docs/Jira/Epic_250130.png)
![Wireframes 30th Jan](docs/Jira/WF_250130.png)

#### 11th February 2025

![Epic 11th Feb](docs/Jira/Epic_250211.png)
![Wireframes 11th Feb](docs/Jira/WF_250211.png)

#### 15th February 2025

![Epic 15th Feb](docs/Jira/Epic_250215.png)
![Wireframes 15th Feb](docs/Jira/WF_250215.png)

### Part B example

#### 20th February 2025

![Epic 20th February 2025](/docs/Jira/sprint%203.PNG)

#### 6th March 2025

![Epic 6th March 2025](/docs/Jira/sprint%204.PNG)

### Testing

Testing was an essential part of our development process to ensure the reliability, security and functionality of our Forever Homes. Both manual testing (through user interactions) and automated testing (using Jest) were performed to validate the application's functionality across different user scenarios.  

The key areas of testing included:

- User authentication (registration & login)

- Pet management (creating, retrieving, updating, deleting pets)

- Adoption applications (submission, approval, rejection)

- User-specific functionalities (favoriting pets)

- API endpoint validation using Jest and Supertest  

#### Successful Registration

![Successful Registration](<docs/testing-images/User Register success.png>)

Upon meeting requirements for registration, users will receive a message saying "User registered successfully". If requirements are not met, they will receive an error, for example if an invalid email is provided, or the email is already in use.

#### Failed Registration

![Failed Registration](<docs/testing-images/User Register reject.PNG>)

#### Successful Login

![Successful Login Screenshot](<docs/testing-images/User login success.PNG>)

#### Failed Login

![Failed Login Screenshot](<docs/testing-images/User login reject.png>)

#### User submits application successfully

![Submit an application](<docs/testing-images/Submit application.PNG>)

When an application has been submitted by a user successfully, an acknowledgement will be sent and the application will be placed in "Pending" status by default.

#### Admin Create Pet Listing

![Create pet listing](<docs/testing-images/Create pet.PNG>)

Successful addition of a pet listing.

##### Update Pet Details with Image

![Update Pet Details with Image](<docs/testing-images/Update Pet Details - Insomnia.png>)

#### Deleting a pet listing by admin

![Delete pet listing](<docs/testing-images/Delete pet.PNG>)

#### Admin retrieve all applications

![Retrieve all applications](<docs/testing-images/Get all applications.PNG>)

#### Retrieve applications with filter applied

![Retrieve all applications with applied filter](<docs/testing-images/Get all applications with filter.PNG>)

Admin can retrieve all submitted applications, regardless of status. Above is a screenshot of the filter being applied, only showing applications for Dogs in Sydney.

#### Application successfully approved

![Application approved message](<docs/testing-images/ApproveReject Application.PNG>)

Using the route applications/:applicationId/approve OR /reject, Administrators are able to approve/reject pending applications.

![Application already processed message](<docs/testing-images/ApproveReject Application processed.PNG>)

If an application has already been processed by another admin and they attempt to be process again, a message will be sent to Admin saying it has already been processed.

#### Adding Pets to Favourites

![Add pet to favourites](<docs/testing-images/favourite pet.PNG>)

![Remove pet from favourites](<docs/testing-images/remove pet from favourites.PNG>)

![Show all favourites](<docs/testing-images/show all favourites.PNG>)

Users are able to add/remove and retrieve all pets from their favourites list but must be logged in. If not logged in, they will be directed to login/sign up.

### Backend Jest Testing

![JEST backend test screenshot](<docs/testing-images/JEST backend test.png>)  

#### Results for User API's

![JEST - User API Endpoints 1](<docs/testing-images/Screenshot 2025-03-09 at 3.03.05 pm.png>)
![JEST - User API Endpoints 2](<docs/testing-images/Screenshot 2025-03-09 at 3.03.28 pm.png>)
![JEST - User API Endpoints 3](<docs/testing-images/Screenshot 2025-03-09 at 3.03.43 pm.png>)

#### Results for Pet API's

![JEST - Pet API Endpoints 1](<docs/testing-images/Screenshot 2025-03-09 at 10.36.13 pm.png>)
![JEST - Pet API Endpoints 2](<docs/testing-images/Screenshot 2025-03-09 at 10.38.14 pm.png>)
![JEST - Pet API Endpoints 3](<docs/testing-images/Screenshot 2025-03-09 at 10.39.18 pm.png>)
![JEST - Pet API Endpoints 4](<docs/testing-images/Screenshot 2025-03-09 at 10.39.43 pm.png>)
![JEST - Pet API Endpoints 5](<docs/testing-images/Screenshot 2025-03-09 at 10.40.01 pm.png>)

#### Results for Application API's

![JEST - Applications API Endpoints 1](<docs/testing-images/Screenshot 2025-03-11 at 4.21.26 am.png>)

### Frontend Jest Testing

![JEST - Frontend Testing](docs/testing-images/Frontendjesttesting.png)
