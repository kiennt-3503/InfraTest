export const lang = {
  signup: {
    title: "人と人を繋げる",
    subTitle:
      "このアプリは、住所を通じて人と人をつなげる便利なプラットフォームです。\n簡単に登録し、近くの人とつながりましょう。",
    note: "MAPAPPを利用するには、コードの入力が必要です。#ann_mapappチャンネルでコードを確認してください！",
    linkGetVerifyCode: "確認コード取得はこちら",
    field: {
      label: {
        username: "ユーザー名",
        password: "パスワード",
        confirmPassword: "確認用パスワード",
        mail: "メール",
        verify_code: "コード",
      },
      placeholder: "{field}を入力してください",
      confirmPassPlaceholder: "パスワードを再入力してください",
      annotation:
        "未登録の場合、パスワードを忘れても再設定できませんのでご注意ください。",
      validate: {
        required_field: "の項目は必須です。",
        invalid_mail: "メールアドレスの形式が正しくありません。",
        password_not_match: "パスワードが一致しません。",
        invalid_password:
          "アルファベット大文字・小文字・数字・記号全てを含む半角10字以上で設定してください。",
        password_too_short: "10文字以上で設定してください。",
        invalid_verify_code: "確認コードは半角英数字6文字で入力してください。",
      },
    },
    button: "サイトにアクセスする",
  },
  logout: {
    success: "ログアウトしました。",
    text: "ログアウト",
  },
  googleMap: {
    searchForm: {
      placeholder: "どこに興味がありますか？",
      prefecture: {
        title: "都道府県",
      },
      district: {
        title: "市区町村",
        notPrefecture: "都道府県を選択してください",
        ofPrefecture: "{prefecture}の市区町村",
      },
      line: {
        title: "路線",
      },
      districtOrLine: {
        title: "市区町村/路線",
      },
    },
  },
  chatroom: {
    memberNumber: "メンバー",
    action: {
      joinRoom: "ルームに参加する",
      chatroom: "ルームでチャット",
      chat: "チャット",
    },
    pleaseSelectChatroom: "チャットを選択してください",
  },
  profile: {
    profileTabs: {
      basicInfo: {
        title: "基本情報",
        field: {
          label: {
            fullname: "氏名",
            fullnameKana: "氏名（カナ）",
            username: "ユーザー名",
            phone: "電話番号",
            dateOfBirth: "生年",
            gender: "性別",
            biography: "自己紹介",
          },
          placeholder: "{field}を入力してください",
        },
      },
      address: "住所",
      hobby: "趣味",
      setting: "設定",
      saveButton: "更新",
    },
    info: {
      username:"ユーザー名",
      name: "氏名",
      mail: "メール",
      phoneNumber: "電話番号",
      address: "住所",
    },
    delete: "削除",
    submit: "登録",
  },
  popup: {
    infoMessage:
      "ウェブサイトを利用するには、住所または駅名のいずれかの入力が必要です。",
    placeSection: "場所",
    stationSection: "駅名",
    postalCode: "郵便番号",
    region: "地域",
    prefecture: "都道府県",
    section: "区画",
    district: "市区町",
    town: "町名",
    station: "駅名",
    streetAddress: "番地",
    validation: {
      region: "地域を選択してください",
      prefecture: "都道府県を選択してください",
      section: "区画を選択してください",
      district: "市区町村を選択してください",
      station: "駅を選択してください",
      combinedForm:
        "住所情報または駅情報のどちらか一方を正しく入力してください。",
    },
    delete: "削除",
    submit: "登録",
  },
  address: {
    postalCode: "郵便番号",
    prefecture: "都道府県",
    city: "市区町村",
    town: "町域",
    address: "番地",
    currentResidence: "ここに住んでいます。",
    selectRole: "役割を選択",
  },
  update: "更新",
};
