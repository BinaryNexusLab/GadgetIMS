declare module 'express-mysql-session' {
  import * as session from 'express-session';
  function MySQLStore(session: any): any;
  export = MySQLStore;
}
