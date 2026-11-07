export type Language = 'en' | 'ru';

export interface PluralEntry {
    one: string;
    few?: string;
    many?: string;
    other: string;
}

export type TranslationEntry = string | PluralEntry;
export type TranslationParams = Record<string, string | number>;

const en = {
    'meta.title': 'Vinyl Store',
    'meta.description': 'Vinyl record catalog, reviews and purchases.',

    'language.label': 'Language',
    'language.en': 'English',
    'language.ru': 'Russian',

    'common.close': 'Close',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.retry': 'Retry',
    'common.loading': 'Loading…',
    'common.loadError': 'Failed to load',
    'common.or': 'or',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.unknownArtist': 'Unknown artist',
    'common.coverAlt': 'Cover: {name}',
    'common.vinyl': 'Vinyl',
    'common.reviews': 'Reviews',
    'common.noReviewsShort': 'no reviews',
    'common.noReviews': 'No reviews yet',
    'common.reviewsCount': {
        one: '{count} review',
        other: '{count} reviews',
    },
    'common.demoNoCharge': 'Demo, no charge',

    'nav.catalog': 'Catalog',
    'nav.profile': 'Profile',
    'nav.admin': 'Admin',
    'nav.manage': 'Manage',
    'nav.login': 'Sign in',
    'nav.register': 'Sign up',
    'nav.logout': 'Sign out',
    'nav.home': 'Home',
    'nav.openMenu': 'Open menu',
    'nav.closeMenu': 'Close menu',

    'footer.github': 'GitHub',
    'footer.license': 'MIT License',

    'auth.tagline': "Music sounds better when it's yours.",
    'auth.description':
        'Sign in to leave reviews, place orders and keep track of your purchase history.',
    'auth.brand': 'vinyl store',
    'auth.googleContinue': 'Continue with Google',

    'api.network':
        'Could not reach the server. Check that the backend is running.',
    'api.unauthorized': 'Authorization required',
    'api.requestError': 'Request failed ({status})',

    'catalog.eyebrow': 'Catalog',
    'catalog.heroTitle': 'Records worth listening to from start to finish',
    'catalog.viewCatalog': 'Browse catalog',
    'catalog.heroNote': 'Hand-picked vinyl with reviews',
    'catalog.searchPlaceholder': 'Search for a record or artist…',
    'catalog.searchAria': 'Search catalog',
    'catalog.reset': 'Reset',
    'catalog.sort': 'Sort',
    'catalog.sortBy': 'Sort by',
    'catalog.sortDirection': 'Sort direction',
    'catalog.sortName': 'Title',
    'catalog.sortAuthor': 'Artist',
    'catalog.sortPrice': 'Price',
    'catalog.orderAsc': 'Ascending',
    'catalog.orderDesc': 'Descending',
    'catalog.found': {
        one: 'Found {count} record',
        other: 'Found {count} records',
    },
    'catalog.loading': 'Loading catalog…',
    'catalog.unavailable': 'Catalog unavailable',
    'catalog.loadError': 'Could not load the catalog',
    'catalog.emptyTitle': 'Nothing found',
    'catalog.emptyFilter':
        'Try a different search or reset the filters.',
    'catalog.emptyCatalog':
        'The catalog is empty. Run the backend seeder or add records in the admin panel.',
    'catalog.resetFilters': 'Reset filters',
    'catalog.perPage': 'Per page:',
    'catalog.perPageAria': 'Number of records per page',

    'vinyl.user': 'User #{id}',
    'vinyl.deleteReview': 'Delete review',
    'vinyl.reviewPublished': 'Thanks! Your review has been published.',
    'vinyl.reviewDeleted': 'Review deleted.',
    'vinyl.demoOrderCreated':
        'Demo order created and added to purchases.',
    'vinyl.notFoundTitle': 'Record not found',
    'vinyl.invalidId':
        'The page URL contains an invalid identifier.',
    'vinyl.backToCatalog': 'Back to catalog',
    'vinyl.removed': 'The record may have been removed from the catalog.',
    'vinyl.rate': 'Rate from 1 to 5.',
    'vinyl.reviewMin': 'Write at least a couple of words about this record.',
    'vinyl.breadcrumbs': 'Breadcrumbs',
    'vinyl.position': 'Catalog position',
    'vinyl.vinylBadge': 'Vinyl',
    'vinyl.price': 'Price',
    'vinyl.buy': 'Buy',
    'vinyl.loginToBuy': 'Sign in to buy',
    'vinyl.stripeNote':
        'Payment is processed by Stripe: the amount comes from the database and a confirmation email is sent.',
    'vinyl.reviewsLoadError': 'Could not load reviews',
    'vinyl.noReviewsBeFirst': 'No reviews yet. Be the first.',
    'vinyl.reviewPage': 'Page {page}',
    'vinyl.leaveReview': 'Leave a review',
    'vinyl.yourRating': 'Your rating',
    'vinyl.impressions': 'Your thoughts',
    'vinyl.reviewPlaceholder':
        'How does the record sound, what is the sleeve like, how is the pressing?',
    'vinyl.publish': 'Publish',
    'vinyl.loginToReview':
        'Only signed-in customers can leave reviews.',
    'vinyl.signIn': 'Sign in',
    'vinyl.demoOrderTitle': 'Demo order created',
    'vinyl.checkoutTitle': 'Checkout',
    'vinyl.orderAdded':
        'The order has been added to your profile purchases.',
    'vinyl.demoPayment':
        'This is a demo payment: no money is charged.',
    'vinyl.done': 'Done',
    'vinyl.checkout': 'Place order',
    'vinyl.record': 'Record',
    'vinyl.amount': 'Amount',
    'vinyl.orderNumber': 'Order number',
    'vinyl.paymentStatus': 'Payment status',
    'vinyl.demoPaymentLong':
        'This is a demo payment: card details are not requested and no money is charged. The order has already been added to your profile purchases.',
    'vinyl.demoPaymentShort':
        'Demo payment: card details are not requested and no real money is charged. The order will appear in your profile after checkout.',
    'vinyl.deleteReviewTitle': 'Delete review?',
    'vinyl.deleteReviewBody':
        'The review will be deleted permanently.',

    'profile.updated': 'Profile updated.',
    'profile.deleted': 'Account deleted.',
    'profile.nameRequired': 'First and last name are required.',
    'profile.admin': 'Administrator',
    'profile.customer': 'Customer',
    'profile.deleteAccount': 'Delete account',
    'profile.purchases': 'Purchases',
    'profile.noPurchases': 'No purchases yet.',
    'profile.orderLine': 'Order #{id} · record #{vinylId}',
    'profile.myReviews': 'My reviews',
    'profile.noReviews': "You haven't left any reviews yet.",
    'profile.editTitle': 'Edit profile',
    'profile.firstName': 'First name',
    'profile.lastName': 'Last name',
    'profile.deleteTitle': 'Delete account?',
    'profile.deleteBody':
        'Your account, reviews and purchase history will be deleted permanently. This action cannot be undone.',

    'login.googleAccountExists':
        'This email is already registered with a password. Sign in with your password.',
    'login.googleEmailNotVerified':
        'This Google account has no verified email. Sign in with your password.',
    'login.googleFailed': 'Could not sign in with Google. Try again.',
    'login.success': 'You are signed in.',
    'login.missing': 'Enter your email and password.',
    'login.title': 'Sign in',
    'login.subtitle': 'Enter your email and password to continue.',
    'login.noAccount': 'No account?',
    'login.register': 'Sign up',
    'login.email': 'Email',
    'login.password': 'Password',
    'login.submit': 'Sign in',

    'register.success': 'Account created. Welcome!',
    'register.firstNameRequired': 'Enter your first name.',
    'register.lastNameRequired': 'Enter your last name.',
    'register.emailInvalid': 'Enter a valid email.',
    'register.passwordShort': 'Password must be at least 8 characters.',
    'register.passwordMismatch': 'Passwords do not match.',
    'register.title': 'Create account',
    'register.subtitle':
        'Create an account to buy records and write reviews.',
    'register.haveAccount': 'Already have an account?',
    'register.signIn': 'Sign in',
    'register.firstName': 'First name',
    'register.lastName': 'Last name',
    'register.firstNamePlaceholder': 'John',
    'register.lastNamePlaceholder': 'Doe',
    'register.email': 'Email',
    'register.password': 'Password',
    'register.passwordHint': 'At least 8 characters',
    'register.confirmPassword': 'Confirm password',
    'register.submit': 'Create account',
    'register.google': 'Sign up with Google',

    'google.missingToken':
        'Google did not return a token. Try signing in again.',
    'google.stateMismatch':
        'Could not verify the Google sign-in. Start again.',
    'google.failedTitle': 'Google sign-in failed',
    'google.backToLogin': 'Back to sign in',
    'google.browserBlocked':
        'Your browser does not allow Google sign-in.',

    'protected.title': 'Access denied',
    'protected.description':
        'This section is available only to store administrators.',
    'protected.back': 'Back to catalog',

    'notFound.title': 'The needle skipped',
    'notFound.description':
        'This page does not exist. Go back to the catalog and pick a record you like.',
    'notFound.back': 'Back to catalog',

    'admin.eyebrow': 'Administration',
    'admin.title': 'Store management',
    'admin.description':
        'Catalog, release import, notifications and audit log. Every change is written to the API log.',
    'admin.tabVinyls': 'Records',
    'admin.tabDiscogs': 'Discogs import',
    'admin.tabTelegram': 'Telegram',
    'admin.tabLogs': 'Audit log',

    'adminVinyls.created': 'Record “{name}” added.',
    'adminVinyls.updated': 'Changes saved.',
    'adminVinyls.deleted': 'Record deleted.',
    'adminVinyls.nameRequired': 'Title and artist are required.',
    'adminVinyls.pricePositive': 'Price must be a positive number.',
    'adminVinyls.title': 'Records',
    'adminVinyls.total': 'Total in catalog: {total}. Newest first.',
    'adminVinyls.add': 'Add record',
    'adminVinyls.emptyTitle': 'Catalog is empty',
    'adminVinyls.emptyDescription':
        'Add the first record manually or import a release from Discogs.',
    'adminVinyls.colRecord': 'Record',
    'adminVinyls.colArtist': 'Artist',
    'adminVinyls.colPrice': 'Price',
    'adminVinyls.colReviews': 'Reviews',
    'adminVinyls.colActions': 'Actions',
    'adminVinyls.open': 'Open record page',
    'adminVinyls.edit': 'Edit',
    'adminVinyls.delete': 'Delete',
    'adminVinyls.editTitle': 'Edit record',
    'adminVinyls.newTitle': 'New record',
    'adminVinyls.editDescription':
        'ID {id}. Changes are written to the audit log.',
    'adminVinyls.newDescription':
        'Fill in the product card. The cover is set by URL.',
    'adminVinyls.name': 'Title',
    'adminVinyls.artist': 'Artist',
    'adminVinyls.priceUsd': 'Price, USD',
    'adminVinyls.image': 'Cover URL',
    'adminVinyls.description': 'Description',
    'adminVinyls.descriptionPlaceholder':
        'Edition, sleeve condition, pressing details…',
    'adminVinyls.deleteTitle': 'Delete record?',
    'adminVinyls.deleteBody':
        '“{name}” will be deleted together with related reviews and purchases.',

    'adminDiscogs.imported': '“{name}” imported into the catalog.',
    'adminDiscogs.invalidId': 'Enter a numeric Discogs release ID.',
    'adminDiscogs.title': 'Discogs import',
    'adminDiscogs.description':
        'Find a release by ID, check the card and add it to the catalog in one click. Import is available to administrators only.',
    'adminDiscogs.idLabel': 'Discogs release ID',
    'adminDiscogs.idPlaceholder': 'For example, 249504',
    'adminDiscogs.find': 'Find release',
    'adminDiscogs.credentialsPrefix': 'Requests to Discogs require',
    'adminDiscogs.and': 'and',
    'adminDiscogs.credentialsSuffix':
        ' on the backend. Without them the API returns an error.',
    'adminDiscogs.enterIdTitle': 'Enter a release ID',
    'adminDiscogs.enterIdDescription':
        'The ID is visible in the release page URL on discogs.com: /release/249504-...',
    'adminDiscogs.fetchError': 'Could not fetch the release',
    'adminDiscogs.rating': 'Rating:',
    'adminDiscogs.import': 'Import into catalog',
    'adminDiscogs.open': 'Open on Discogs',
    'adminDiscogs.priceNote':
        'The price comes from Discogs lowest_price; if missing, it will be 0. Check the price after import.',

    'adminTelegram.selectRequired': 'Select a record.',
    'adminTelegram.sent': 'Card sent to Telegram.',
    'adminTelegram.selectFromList': 'Select a record from the list.',
    'adminTelegram.invalidPrice':
        'The selected record has an invalid price.',
    'adminTelegram.loadError': 'Could not load the catalog.',
    'adminTelegram.title': 'Telegram notification',
    'adminTelegram.description':
        'Pick a record from the catalog — the title, link and price are filled in automatically. The message is sent through the Bot API on the backend.',
    'adminTelegram.record': 'Record',
    'adminTelegram.linkHint':
        'The link points to the selected record page on this site.',
    'adminTelegram.loadingCatalog': 'Loading catalog…',
    'adminTelegram.emptyCatalog': 'No records in the catalog',
    'adminTelegram.selectPlaceholder': 'Select a record…',
    'adminTelegram.envPrefix': 'Requires',
    'adminTelegram.envSuffix': 'in the backend .env.',
    'adminTelegram.send': 'Send',

    'adminLogs.title': 'Audit log',
    'adminLogs.description':
        'Every create, update and delete on the backend is written to the logs table.',
    'adminLogs.refresh': 'Refresh',
    'adminLogs.filterPlaceholder': 'Filter by action text…',
    'adminLogs.filterAria': 'Filter log',
    'adminLogs.noMatches': 'No matches',
    'adminLogs.empty': 'Log is empty',
    'adminLogs.tryAnother': 'Try another query.',
    'adminLogs.emptyDescription':
        'Actions will appear here after the first catalog changes.',
    'adminLogs.time': 'Time',
    'adminLogs.action': 'Action',
    'adminLogs.shown': 'Showing {shown} of {total} entries.',

    'toast.close': 'Close notification',
    'states.retry': 'Retry',

    'stars.rating': 'Rating',
    'stars.ratingValue': 'Rating: {value} out of 5',
    'stars.star': '{star} out of 5',

    'pagination.label': 'Pagination',
    'pagination.previous': 'Previous page',
    'pagination.next': 'Next page',

    'modal.close': 'Close',
} satisfies Record<string, TranslationEntry>;

export type TranslationKey = keyof typeof en;

const ru: Record<TranslationKey, TranslationEntry> = {
    'meta.title': 'Vinyl Store',
    'meta.description': 'Каталог пластинок, отзывы и покупки.',

    'language.label': 'Язык',
    'language.en': 'Английский',
    'language.ru': 'Русский',

    'common.close': 'Закрыть',
    'common.cancel': 'Отмена',
    'common.save': 'Сохранить',
    'common.delete': 'Удалить',
    'common.edit': 'Редактировать',
    'common.retry': 'Повторить',
    'common.loading': 'Загрузка…',
    'common.loadError': 'Ошибка загрузки',
    'common.or': 'или',
    'common.back': 'Назад',
    'common.next': 'Дальше',
    'common.unknownArtist': 'Неизвестный исполнитель',
    'common.coverAlt': 'Обложка: {name}',
    'common.vinyl': 'Винил',
    'common.reviews': 'Отзывы',
    'common.noReviewsShort': 'без отзывов',
    'common.noReviews': 'Отзывов пока нет',
    'common.reviewsCount': {
        one: '{count} отзыв',
        few: '{count} отзыва',
        many: '{count} отзывов',
        other: '{count} отзыва',
    },
    'common.demoNoCharge': 'Демо, без списания',

    'nav.catalog': 'Каталог',
    'nav.profile': 'Профиль',
    'nav.admin': 'Админка',
    'nav.manage': 'Управление',
    'nav.login': 'Войти',
    'nav.register': 'Регистрация',
    'nav.logout': 'Выйти',
    'nav.home': 'На главную',
    'nav.openMenu': 'Открыть меню',
    'nav.closeMenu': 'Закрыть меню',

    'footer.github': 'GitHub',
    'footer.license': 'MIT License',

    'auth.tagline': 'Музыка звучит лучше, когда она ваша.',
    'auth.description':
        'Войдите, чтобы оставлять отзывы, оформлять заказы и следить за историей покупок.',
    'auth.brand': 'vinyl store',
    'auth.googleContinue': 'Продолжить с Google',

    'api.network':
        'Не удалось связаться с сервером. Проверьте, запущен ли бэкенд.',
    'api.unauthorized': 'Требуется авторизация',
    'api.requestError': 'Ошибка запроса ({status})',

    'catalog.eyebrow': 'Каталог',
    'catalog.heroTitle': 'Пластинки, которые хочется слушать целиком',
    'catalog.viewCatalog': 'Смотреть каталог',
    'catalog.heroNote': 'Отобранный винил с отзывами',
    'catalog.searchPlaceholder': 'Найти пластинку или исполнителя…',
    'catalog.searchAria': 'Поиск по каталогу',
    'catalog.reset': 'Сбросить',
    'catalog.sort': 'Сортировка',
    'catalog.sortBy': 'Сортировать по',
    'catalog.sortDirection': 'Направление сортировки',
    'catalog.sortName': 'Название',
    'catalog.sortAuthor': 'Исполнитель',
    'catalog.sortPrice': 'Цена',
    'catalog.orderAsc': 'По возрастанию',
    'catalog.orderDesc': 'По убыванию',
    'catalog.found': {
        one: 'Найдена {count} пластинка',
        few: 'Найдено {count} пластинки',
        many: 'Найдено {count} пластинок',
        other: 'Найдено {count} пластинки',
    },
    'catalog.loading': 'Загружаем каталог…',
    'catalog.unavailable': 'Каталог недоступен',
    'catalog.loadError': 'Не удалось загрузить каталог',
    'catalog.emptyTitle': 'Ничего не нашлось',
    'catalog.emptyFilter':
        'Попробуйте изменить запрос или сбросить фильтры.',
    'catalog.emptyCatalog':
        'Каталог пока пуст. Запустите сидер на бэкенде или добавьте пластинки в админке.',
    'catalog.resetFilters': 'Сбросить фильтры',
    'catalog.perPage': 'На странице:',
    'catalog.perPageAria': 'Количество пластинок на странице',

    'vinyl.user': 'Пользователь #{id}',
    'vinyl.deleteReview': 'Удалить отзыв',
    'vinyl.reviewPublished': 'Спасибо! Отзыв опубликован.',
    'vinyl.reviewDeleted': 'Отзыв удалён.',
    'vinyl.demoOrderCreated':
        'Демо-заказ создан и добавлен в покупки.',
    'vinyl.notFoundTitle': 'Пластинка не найдена',
    'vinyl.invalidId':
        'В адресе страницы указан некорректный идентификатор.',
    'vinyl.backToCatalog': 'Вернуться в каталог',
    'vinyl.removed': 'Возможно, запись удалили из каталога.',
    'vinyl.rate': 'Поставьте оценку от 1 до 5.',
    'vinyl.reviewMin':
        'Напишите хотя бы пару слов об этой пластинке.',
    'vinyl.breadcrumbs': 'Хлебные крошки',
    'vinyl.position': 'Позиция в каталоге',
    'vinyl.vinylBadge': 'Винил',
    'vinyl.price': 'Цена',
    'vinyl.buy': 'Купить',
    'vinyl.loginToBuy': 'Войти и купить',
    'vinyl.stripeNote':
        'Оплата проходит через Stripe: сумма берётся из базы, а на почту приходит подтверждение заказа.',
    'vinyl.reviewsLoadError': 'Не удалось загрузить отзывы',
    'vinyl.noReviewsBeFirst': 'Отзывов пока нет. Будьте первым.',
    'vinyl.reviewPage': 'Страница {page}',
    'vinyl.leaveReview': 'Оставить отзыв',
    'vinyl.yourRating': 'Ваша оценка',
    'vinyl.impressions': 'Впечатления',
    'vinyl.reviewPlaceholder':
        'Как звучит пластинка, состояние конверта, качество издания…',
    'vinyl.publish': 'Опубликовать',
    'vinyl.loginToReview':
        'Отзывы могут оставлять только авторизованные покупатели.',
    'vinyl.signIn': 'Войти в аккаунт',
    'vinyl.demoOrderTitle': 'Демо-заказ создан',
    'vinyl.checkoutTitle': 'Оформление покупки',
    'vinyl.orderAdded':
        'Заказ добавлен в раздел «Покупки» профиля.',
    'vinyl.demoPayment':
        'Оплата демонстрационная: реальные деньги не списываются.',
    'vinyl.done': 'Готово',
    'vinyl.checkout': 'Оформить',
    'vinyl.record': 'Пластинка',
    'vinyl.amount': 'Сумма',
    'vinyl.orderNumber': 'Номер заказа',
    'vinyl.paymentStatus': 'Статус платежа',
    'vinyl.demoPaymentLong':
        'Это демонстрационная оплата: данные карты не запрашиваются, деньги не списываются. Заказ уже добавлен в раздел «Покупки» профиля.',
    'vinyl.demoPaymentShort':
        'Оплата демонстрационная: данные карты не запрашиваются, реальные деньги не списываются. После оформления заказ появится в профиле.',
    'vinyl.deleteReviewTitle': 'Удалить отзыв?',
    'vinyl.deleteReviewBody':
        'Отзыв будет удалён без возможности восстановления.',

    'profile.updated': 'Профиль обновлён.',
    'profile.deleted': 'Аккаунт удалён.',
    'profile.nameRequired': 'Имя и фамилия обязательны.',
    'profile.admin': 'Администратор',
    'profile.customer': 'Покупатель',
    'profile.deleteAccount': 'Удалить аккаунт',
    'profile.purchases': 'Покупки',
    'profile.noPurchases': 'Покупок пока нет.',
    'profile.orderLine': 'Заказ #{id} · пластинка #{vinylId}',
    'profile.myReviews': 'Мои отзывы',
    'profile.noReviews': 'Вы ещё не оставили ни одного отзыва.',
    'profile.editTitle': 'Редактировать профиль',
    'profile.firstName': 'Имя',
    'profile.lastName': 'Фамилия',
    'profile.deleteTitle': 'Удалить аккаунт?',
    'profile.deleteBody':
        'Аккаунт, отзывы и история покупок будут удалены без возможности восстановления. Это действие необратимо.',

    'login.googleAccountExists':
        'Этот email уже зарегистрирован с паролем. Войдите с помощью пароля.',
    'login.googleEmailNotVerified':
        'У этого Google-аккаунта нет подтверждённого email. Войдите по паролю.',
    'login.googleFailed':
        'Не удалось войти через Google. Попробуйте ещё раз.',
    'login.success': 'Вы вошли в аккаунт.',
    'login.missing': 'Заполните email и пароль.',
    'login.title': 'Вход',
    'login.subtitle': 'Введите email и пароль, чтобы продолжить.',
    'login.noAccount': 'Нет аккаунта?',
    'login.register': 'Зарегистрироваться',
    'login.email': 'Email',
    'login.password': 'Пароль',
    'login.submit': 'Войти',

    'register.success': 'Аккаунт создан. Добро пожаловать!',
    'register.firstNameRequired': 'Укажите имя.',
    'register.lastNameRequired': 'Укажите фамилию.',
    'register.emailInvalid': 'Введите корректный email.',
    'register.passwordShort':
        'Пароль должен быть не короче 8 символов.',
    'register.passwordMismatch': 'Пароли не совпадают.',
    'register.title': 'Регистрация',
    'register.subtitle':
        'Создайте аккаунт, чтобы покупать пластинки и писать отзывы.',
    'register.haveAccount': 'Уже есть аккаунт?',
    'register.signIn': 'Войти',
    'register.firstName': 'Имя',
    'register.lastName': 'Фамилия',
    'register.firstNamePlaceholder': 'Иван',
    'register.lastNamePlaceholder': 'Петров',
    'register.email': 'Email',
    'register.password': 'Пароль',
    'register.passwordHint': 'Минимум 8 символов',
    'register.confirmPassword': 'Повторите пароль',
    'register.submit': 'Создать аккаунт',
    'register.google': 'Зарегистрироваться через Google',

    'google.missingToken':
        'Google не вернул токен. Попробуйте войти ещё раз.',
    'google.stateMismatch':
        'Не удалось проверить вход через Google. Начните вход заново.',
    'google.failedTitle': 'Вход через Google не удался',
    'google.backToLogin': 'Вернуться ко входу',
    'google.browserBlocked':
        'Браузер не позволяет начать вход через Google.',

    'protected.title': 'Доступ закрыт',
    'protected.description':
        'Раздел доступен только администраторам магазина.',
    'protected.back': 'Вернуться в каталог',

    'notFound.title': 'Иголка соскочила',
    'notFound.description':
        'Такой страницы нет. Вернитесь в каталог и выберите пластинку по вкусу.',
    'notFound.back': 'В каталог',

    'admin.eyebrow': 'Администрирование',
    'admin.title': 'Управление магазином',
    'admin.description':
        'Каталог, импорт релизов, уведомления и журнал действий. Все изменения пишутся в лог на стороне API.',
    'admin.tabVinyls': 'Пластинки',
    'admin.tabDiscogs': 'Импорт из Discogs',
    'admin.tabTelegram': 'Telegram',
    'admin.tabLogs': 'Журнал действий',

    'adminVinyls.created': 'Пластинка «{name}» добавлена.',
    'adminVinyls.updated': 'Изменения сохранены.',
    'adminVinyls.deleted': 'Пластинка удалена.',
    'adminVinyls.nameRequired':
        'Название и исполнитель обязательны.',
    'adminVinyls.pricePositive':
        'Цена должна быть положительным числом.',
    'adminVinyls.title': 'Пластинки',
    'adminVinyls.total':
        'Всего в каталоге: {total}. Новые записи — первыми.',
    'adminVinyls.add': 'Добавить пластинку',
    'adminVinyls.emptyTitle': 'Каталог пуст',
    'adminVinyls.emptyDescription':
        'Добавьте первую пластинку вручную или импортируйте релиз из Discogs.',
    'adminVinyls.colRecord': 'Пластинка',
    'adminVinyls.colArtist': 'Исполнитель',
    'adminVinyls.colPrice': 'Цена',
    'adminVinyls.colReviews': 'Отзывы',
    'adminVinyls.colActions': 'Действия',
    'adminVinyls.open': 'Открыть страницу пластинки',
    'adminVinyls.edit': 'Редактировать',
    'adminVinyls.delete': 'Удалить',
    'adminVinyls.editTitle': 'Редактировать пластинку',
    'adminVinyls.newTitle': 'Новая пластинка',
    'adminVinyls.editDescription':
        'ID {id}. Изменения попадут в журнал действий.',
    'adminVinyls.newDescription':
        'Заполните карточку товара. Обложка задаётся ссылкой.',
    'adminVinyls.name': 'Название',
    'adminVinyls.artist': 'Исполнитель',
    'adminVinyls.priceUsd': 'Цена, USD',
    'adminVinyls.image': 'Ссылка на обложку',
    'adminVinyls.description': 'Описание',
    'adminVinyls.descriptionPlaceholder':
        'Издание, состояние конверта, особенности пресса…',
    'adminVinyls.deleteTitle': 'Удалить пластинку?',
    'adminVinyls.deleteBody':
        '«{name}» будет удалена вместе со связанными отзывами и покупками.',

    'adminDiscogs.imported': '«{name}» импортирована в каталог.',
    'adminDiscogs.invalidId':
        'Введите числовой ID релиза Discogs.',
    'adminDiscogs.title': 'Импорт из Discogs',
    'adminDiscogs.description':
        'Найдите релиз по ID, проверьте карточку и добавьте его в каталог одним нажатием. Импорт доступен только администратору.',
    'adminDiscogs.idLabel': 'ID релиза Discogs',
    'adminDiscogs.idPlaceholder': 'Например, 249504',
    'adminDiscogs.find': 'Найти релиз',
    'adminDiscogs.credentialsPrefix':
        'Для запросов к Discogs на бэкенде должны быть заданы',
    'adminDiscogs.and': 'и',
    'adminDiscogs.credentialsSuffix':
        '. Без них API вернёт ошибку.',
    'adminDiscogs.enterIdTitle': 'Укажите ID релиза',
    'adminDiscogs.enterIdDescription':
        'ID виден в адресе страницы релиза на discogs.com: /release/249504-...',
    'adminDiscogs.fetchError': 'Не удалось получить релиз',
    'adminDiscogs.rating': 'Рейтинг:',
    'adminDiscogs.import': 'Импортировать в каталог',
    'adminDiscogs.open': 'Открыть на Discogs',
    'adminDiscogs.priceNote':
        'Цена берётся из lowest_price Discogs; если её нет, будет 0. Проверьте цену после импорта.',

    'adminTelegram.selectRequired': 'Выберите пластинку.',
    'adminTelegram.sent': 'Карточка отправлена в Telegram.',
    'adminTelegram.selectFromList':
        'Выберите пластинку из списка.',
    'adminTelegram.invalidPrice':
        'У выбранной пластинки некорректная цена.',
    'adminTelegram.loadError': 'Не удалось загрузить каталог.',
    'adminTelegram.title': 'Уведомление в Telegram',
    'adminTelegram.description':
        'Выберите пластинку из каталога — название, ссылка и цена подставятся автоматически. Сообщение уходит через Bot API на стороне бэкенда.',
    'adminTelegram.record': 'Пластинка',
    'adminTelegram.linkHint':
        'Ссылка ведёт на страницу выбранной пластинки на этом сайте.',
    'adminTelegram.loadingCatalog': 'Загружаем каталог…',
    'adminTelegram.emptyCatalog': 'В каталоге нет пластинок',
    'adminTelegram.selectPlaceholder': 'Выберите пластинку…',
    'adminTelegram.envPrefix': 'Нужны',
    'adminTelegram.envSuffix': 'в .env бэкенда.',
    'adminTelegram.send': 'Отправить',

    'adminLogs.title': 'Журнал действий',
    'adminLogs.description':
        'Каждое создание, изменение и удаление на бэкенде пишется в таблицу logs.',
    'adminLogs.refresh': 'Обновить',
    'adminLogs.filterPlaceholder': 'Фильтр по тексту действия…',
    'adminLogs.filterAria': 'Фильтр журнала',
    'adminLogs.noMatches': 'Совпадений нет',
    'adminLogs.empty': 'Журнал пуст',
    'adminLogs.tryAnother': 'Попробуйте другой запрос.',
    'adminLogs.emptyDescription':
        'Действия появятся здесь после первых изменений в каталоге.',
    'adminLogs.time': 'Время',
    'adminLogs.action': 'Действие',
    'adminLogs.shown': 'Показано {shown} из {total} записей.',

    'toast.close': 'Закрыть уведомление',
    'states.retry': 'Повторить',

    'stars.rating': 'Оценка',
    'stars.ratingValue': 'Оценка: {value} из 5',
    'stars.star': '{star} из 5',

    'pagination.label': 'Пагинация',
    'pagination.previous': 'Предыдущая страница',
    'pagination.next': 'Следующая страница',

    'modal.close': 'Закрыть',
};

const dictionaries: Record<Language, Record<TranslationKey, TranslationEntry>> = {
    en,
    ru,
};

const pluralRules: Record<Language, Intl.PluralRules> = {
    en: new Intl.PluralRules('en-US'),
    ru: new Intl.PluralRules('ru-RU'),
};

const LANGUAGE_KEY = 'vinyl_store_language';
let currentLanguage: Language = 'en';

export function getStoredLanguage(): Language {
    try {
        return localStorage.getItem(LANGUAGE_KEY) === 'ru' ? 'ru' : 'en';
    } catch {
        return 'en';
    }
}

export function storeLanguage(language: Language): void {
    try {
        localStorage.setItem(LANGUAGE_KEY, language);
    } catch {
        /* storage may be unavailable */
    }
}

export function getLanguage(): Language {
    return currentLanguage;
}

export function setCurrentLanguage(language: Language): void {
    currentLanguage = language;
}

export function translate(
    language: Language,
    key: TranslationKey,
    params: TranslationParams = {},
): string {
    const entry = dictionaries[language][key] ?? dictionaries.en[key];
    let template: string;

    if (typeof entry === 'string') {
        template = entry;
    } else {
        const count = typeof params.count === 'number' ? params.count : 0;
        const category = pluralRules[language].select(count);
        template = entry[category as keyof PluralEntry] ?? entry.other;
    }

    return template.replace(/\{(\w+)\}/g, (match, name: string) => {
        const value = params[name];
        return value === undefined ? match : String(value);
    });
}

export function t(
    key: TranslationKey,
    params: TranslationParams = {},
): string {
    return translate(currentLanguage, key, params);
}
