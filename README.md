# os-custom-elements

## Useful commands

1. `npm run server` - build and run express server at `http://localhost:5050`
2. `npm run test` - run cypress tests
3. `npm run dev` - webpack-dev-server at `http://localhost:5050`
4. `npm run cy:open` - open up the Cypress test runner

## Cypress testing

1. Run `npm run dev` in the first window
2. Run `npm run cy:open` in the second window
3. Click on needed specs file to run

## Deployment

1. Open Semaphore CI build for the needed commit.
2. Navigate to the "Promotions" step and click on the "S3 deploy" button.

3. The deployment script will upload all versions of the script:

    - For the `main` branch, versions will be uploaded to the `avala-html-form-script` bucket.
    - For all other branches, versions will be uploaded to the `avala-test-html-form-script` bucket.
4. The script will be placed in the `os-custom-elements` folder within the respective bucket.

5. After completion, your script will be accessible under:

    - `cdn.formli.com` domain for the `main` branch.
    - `avala-html-form-script.s3.us-east-2.amazonaws.com` for all other branches.

### Versions

The following script versions will be uploaded:

1. **`os-custom-elements-v*.min.js`**: These versions will be regularly updated and should be used for production.

2. **`os-custom-elements.[checksum].js`**: Unique versions identified by their checksum.

3. **`os-custom-elements.[checksum].min.js`**: Minified versions corresponding to the unique checksums.

### Retrieve Build URL

1. In Semaphore CI, navigate to the "Promotions" section.

2. Check the logs for a line similar to the following:

    ```bash
    if [ "$SEMAPHORE_GIT_BRANCH" = "main" ]; then
    ```

3. Note the build name from the subsequent line, which looks like:

    ```bash
    upload: dist/os-forms-v1.min.js to s3://avala-html-form-script/html-forms/os-custom-elements-v1.min.js
    ```

4. Copy the script name and build URL. The script URL for this specific build will be:

    - For the `master` branch:

        ```bash
        https://cdn.formli.com/os-custom-elements/os-custom-elements-v1.min.js
        ```

    - For other branches:

        ```bash
        https://avala-test-html-form-script.s3.us-east-2.amazonaws.com/os-custom-elements/os-custom-elements-v1.min.js
        ```
