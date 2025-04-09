const core = require('@actions/core')//inputs nd outputs
const exec = require('@actions/exec')//uploading to s3


function run() {
  //get inputs

  const bucket = core.getInput('bucket', {required: true})
  const bucketRegion = core.getInput('bucket-region', {required: true})
  const distFolder = core.getInput('dist-folder', {required: true})
  //Upload files to s3 bucket


  const s3URI = `s3://${bucket}`
  exec.exec(`aws s3 sync ${distFolder} ${s3URI} --region ${bucketRegion}`)

  //Get Url
  const websiteURL = `https://${bucket}.s3-website-${bucketRegion}.amazonaws.com`
  // http://dkcohort.s3-website-us-east-1.amazonaws.com

  core.setOutput('website-url', websiteURL)

}
run()