# blogexercisefront

This is a front for "blogexercise" or "blogexercisewithopenapi"

It is made in `React` with `TypeScript`.

It was bootstrapped with `Create React App`.

To launch project:
* `npm run start` or `yarn start`

To launch test:
* `npm run test` or `yarn test`

Before launching test, you need to install the selenium's driver of the browser that will be used for testing.<br />
It is required as some of the test use selenium.<br />
And add the driver to PATH: `export PATH="$PATH:/path/to/chromedriver"`<br />
It is explained on the selenium page.
https://www.selenium.dev/documentation/en/webdriver/driver_requirements/

To build project:
* `npm run build` or `yarn build`

It builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />

------------
`yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.
