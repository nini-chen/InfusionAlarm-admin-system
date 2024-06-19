// =================================
// ======= 项目发布版本信息 =========
// =================================

const child_process = require('child_process');

function formatDate(dateObj) {
  if (!dateObj) return '';
  return `${dateObj.getFullYear()}-${
    dateObj.getMonth() + 1
  }-${dateObj.getDate()}/${dateObj.getHours()}:${dateObj.getMinutes()}`;
}

/*
 * git记录信息非常多，下面仅调用了几个我们需要的，其余如需要，可以参考文档：
 * https://git-scm.com/docs/git-show    https://git-scm.com/docs/git
 */
const localBranchName = child_process.execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
const commitHash = child_process.execSync('git show -s --format=%H').toString().trim();
const branchName = child_process
  .execSync(`git rev-parse --abbrev-ref ${localBranchName}@{upstream}`)
  .toString()
  .trim();
const commitDateObj = new Date(child_process.execSync('git show -s --format=%cd').toString());
const commitDate = formatDate(commitDateObj);
const buildDate = formatDate(new Date());

/*
 * 后续在打包操作npm run build的时候，将__MEDICAL__BUILDING__VERSION__挂到window对象中, 目的是为了方便项目发布后，可以追溯了解项目是什么版本
 * 当发布上线后，在浏览器中：按键盘F12 -> 点击console -> 输入window.__MEDICAL__BUILDING__VERSION__ 再按键盘enter键，就可以查看到这些信息了
 */
export const __MEDICAL__BUILDING__VERSION__ = {
  branchName, // 本项目git分支名
  commitHash, // 截至到打包的时候，本项目git最后一次提交的哈斯id值
  commitDate, // 最后一次提交的日期时间
  buildDate, // 打包的日期时间
};
