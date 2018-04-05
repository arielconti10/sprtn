pipeline {
  agent any
  parameters {
    string(name: 'REQUESTER_MAIL', defaultValue: '')
    string(name: 'DEVS_MAIL', defaultValue: 'henrique.pessolato@ftd.com.br')
  }
  stages {
    stage('Build') {
      steps {
        sh runNpm()
      }
    }
    stage('Deploy') {
      steps {
        sh "shipit ${getEnvironment().toLowerCase()} deploy permissions"
      }
    }
  }
  post {
    success {
      mail (
        to: params.REQUESTER_MAIL,
        cc: params.DEVS_MAIL,
        subject: "SUCCESS: Job '${env.JOB_NAME}' [${env.BUILD_NUMBER}]",
        mimeType: 'text/html',
        body: "A new software version has been released in '${getEnvironment()}'"
      )
      echo "Successful email has been sent!"
    }
    failure {
      mail (
        to: params.DEVS_MAIL,
        subject: "FAILED: Job '${env.JOB_NAME}' [${env.BUILD_NUMBER}]",
        mimeType: 'text/html',
        body: "Something went wrong on project build! Please check it. '${env.BUILD_URL}'"
      )
      echo "Failure email has been sent!"
    }
  }
}

def runNpm() {
    return 'npm start build'
}

def getEnvironment() {
  def branch = "${env.BRANCH_NAME}"
  if (branch == "master") {
    return "Production"
  } else if (branch == "staging") {
    return "Staging"
  } else {
    return "Development"
  }
}