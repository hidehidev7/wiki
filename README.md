# 概要
[florr.io JPwiki](https://newflorrio.wiki.fc2.com)で使用されるソースコード群。


# 構造
主に特殊構文のソースコード管理用です。
<br>
スタイルシートやフリーエリアのHTMLファイル等、第三者が編集可能なflorr.io JPwikiの一連の関連ファイルも含みます。
<br>
<br>
`scripts`ディレクトリはwikiで直接実行されるjsファイルを集約しています。github pageを通じて、wikiのクライアント側からこれらのファイルを呼び出しています。
<br>
<br>
構造と説明は以下の通りです。
```
.
└── scripts/
    ├── abolished/
    │   └── ...
    ├── general/
    │   └── ...
    ├── unique syntax/
    │   └── ...
    ├── user script/
    │   └── ...
    ├── util/
    │   └── ...
    └── config.json
```
<dl>
    <dt>abolished</dt>
        <dd>現在は廃止されているスクリプトのアーカイブ</dd>
    <dt>general</dt>
        <dd>既定で実行される関数群</dd>
    <dt>unique syntax</dt>
        <dd>特殊構文が呼び出されたときに実行される関数群</dd>
    <dt>user script</dt>
        <dd>特定のページにおいてのみ実行される関数群</dd>
    <dt>util</dt>
        <dd>他のスクリプトの一部がインポートする関数群</dd>
</dl>


# 記述規則
`scripts`ディレクトリ内のjsファイルを編集する際には以下の点に留意します。
- クライアント側で実行されるべき関数は`export`する
- その関数名は必ず`main`とする
- 新規にjsファイルを作成した場合、`config.json`に関数名と各種プロパティを設定する

---

(c)
[florr.io JPwiki](https://newflorrio.wiki.fc2.com) 及び [JP Flowers](https://discord.com/invite/9Gnhj6KXMc)コミュニティメンバー