// const targetFolder = DriveApp.getFolderById('フォルダ名');
// const notion_token = 'トークン';
// const database_id = 'データベースID';

function checkFile() {
  const files = targetFolder.getFiles();
  const now = new Date();
  while (files.hasNext()) {
    let file = files.next();
    let createDate = file.getDateCreated();
    const timeDiff = (now.getTime() - createDate.getTime()) / (60 * 1000);
    if (5 >= timeDiff) {
      let file_name = file.getName();
      console.log(file_name);
      let file_url = file.getUrl();
      let preview_url = file_url.replace("view?usp=drivesdk", "preview");
      make_page(file_name, preview_url);
    }
  }
}

function make_page(text, file_url) {
  const url = 'https://api.notion.com/v1/pages';
  const headers = {
    'Content-Type': 'application/json; charset=UTF-8',
    'Authorization': 'Bearer ' + notion_token,
    'Notion-Version': '2021-05-13',
  };
  const post_data = {
    'parent': { 'database_id': database_id },
    'properties': {
      'Name': {
        'title': [
          {
            'text': {
              'content': text,
            }
          }
        ]
      }
    },
    'children': [
      {
        "object": "block",
        "type": "embed",
        "embed": {
          "url": file_url
        }
      }
    ]
  };
  const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
    "method": "post",
    "headers": headers,
    "payload": JSON.stringify(post_data)
  };
  return UrlFetchApp.fetch(url, options);
}
