# goodnotes_to_notion
Googleドライブの任意のフォルダ内のPDFを、Notionの新しいページに埋め込みます。Goodnotes5で自動バックアップしたPDFをNotionで簡単に閲覧するために作りました。
## 使い方
GoogleドライブのID、インテグレーションのトークン、データベースのIDを設定して、claspでpushしてください。トリガーは1分ごとに設定してください。

以下のコードをGASに直接コピペしても使えます。
```main.gs
// const targetFolder = DriveApp.getFolderById('フォルダ名');
// const notion_token = 'トークン';
// const database_id = 'データベースID';
function checkFile() {
    var files = targetFolder.getFiles();
    var now = new Date();
    while (files.hasNext()) {
        var file = files.next();
        var createDate = file.getDateCreated();
        var timeDiff = (now.getTime() - createDate.getTime()) / (60 * 1000);
        if (1 >= timeDiff) {
            var file_name = file.getName();
            console.log(file_name);
            var file_url = file.getUrl();
            var preview_url = file_url.replace("view?usp=drivesdk", "preview");
            make_page(file_name, preview_url);
        }
    }
}
function make_page(text, file_url) {
    var url = 'https://api.notion.com/v1/pages';
    var headers = {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer ' + notion_token,
        'Notion-Version': '2021-05-13'
    };
    var post_data = {
        'parent': { 'database_id': database_id },
        'properties': {
            'Name': {
                'title': [
                    {
                        'text': {
                            'content': text
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
    var options = {
        "method": "post",
        "headers": headers,
        "payload": JSON.stringify(post_data)
    };
    return UrlFetchApp.fetch(url, options);
}
```
