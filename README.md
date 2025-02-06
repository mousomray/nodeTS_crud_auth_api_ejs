# How to setup typescript in nodeJS ? 
Ans : 
1) create npm init -y and install dependency which you install generally start of every nodeJS project

2) Create main file which was app.js or index.js that will be index.ts

3) npm install typescript ts-node @types/node @types/express --save-dev 
Install this for typescript, connect node with typescript and use express with typescript

4) npx tsc --init 
After doing this there will be create a file tsconfig.json. Replace tsconfig.json file material with another code which I use earlier

5) Create a folder dist in your project root directory where will be keep our code which is need for deplyment build. after npm run build data will be added in dist folder

6) In TypeScript there will not be use old import export technique there will be use es6 import export technique 

7) Make nodemon start area app.js to app.ts

8) When you install any dependency in typescript use @types/ before depencency name npm i @types/cors --save-dev

9) I have to create a folder in app folder name will be interface there will be create interface for all model for perfect validation and use it in model file

10) You have to use Promise<any> for to handle async operation function in typescript 

11) You have to install two depency normal js dependency and devdependency for typescript 
suppose I use jsonwebtoken then I have to use #npm i jsonwebtoken and #npm i @types/jsonwebtoken --save-dev 

12) Start typescript app npm run dev