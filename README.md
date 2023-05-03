# なんか良い感じにDiscordからMinecraftサーバーを起動するbot
このBOTはDiscord Slash CommandによってMinecraftサーバーの起動停止を管理する目的で作成されました.  
Google Cloud Functionsの認証あり呼び出しによってサーバーの起動停止が管理できる環境を想定しています.  
従って, このプログラム自体は送信されたSlash Commandに対応するCloud Functionsを呼び出す以外に一切の副作用を持ちません.  

# 追記: Cloud Functions経由のCompute Engine起動停止について
+ Compute Engineの起動停止は`roles/compute.instances.start`と`roles/compute.instances.stop`が必要
  + 上のroleを付与したサービスアカウントを作って、その秘密鍵をCloud Functionの中に仕込んでおく
  + Cloud Client Libraryを使うと良い感じに認証してくれる
  + **Cloud Functionsデプロイ時に環境変数`GOOGLE_APPLICATION_CREDENTIALS`に秘密鍵へのパスを設定するのを忘れずに(1敗)**
# 追記2: Cloud Functionsの認証あり呼び出しについて
+ Cloud Functionsの認証あり呼び出しには`roles/run.invoker`が必要
  + 認証はBearerで行う。Tokenは`$gcloud auth print-identity-token`で表示するのが簡単だが、一定時間で使えなくなるっぽい(？)
  + これをどう行うか悩み中
    + Cloud Functionsを認証ありで起動するためにTokenが必要で
    + Tokenを生成するために`gcloud`コマンドが必要で
    + `gcloud`コマンドを使うために認証が必要で(？？？？)
      + これも権限を付与したサービスアカウント認証してToken生成すればokそう
      + それならそのサービスアカウントで直接Compute Engine起動すれば良くない？
