import { Component, Vue } from 'vue-property-decorator'
import './table.scss'
import XLSX from 'xlsx'

@Component
export default class excelToolTable extends Vue {
  
  data () {
    return {
      inputVal: null,
      fileName: '',
      tableData: {
        allData: [{"编号":1,"姓名":"刘晶鑫01","年龄":21},{"编号":2,"姓名":"刘晶鑫02","年龄":22},{"编号":3,"姓名":"刘晶鑫03","年龄":23},{"编号":4,"姓名":"刘晶鑫04","年龄":24},{"编号":5,"姓名":"刘晶鑫05","年龄":25},{"编号":6,"姓名":"刘晶鑫06","年龄":26},{"编号":7,"姓名":"刘晶鑫07","年龄":2},{"编号":8,"姓名":"刘晶鑫08","年龄":545},{"编号":9,"姓名":"刘晶鑫09","年龄":25656},{"编号":10,"姓名":"刘晶鑫10","年龄":5756},{"编号":11,"姓名":"刘晶鑫11","年龄":21},{"编号":12,"姓名":"刘晶鑫12","年龄":22},{"编号":13,"姓名":"刘晶鑫13","年龄":23},{"编号":14,"姓名":"刘晶鑫14","年龄":24},{"编号":15,"姓名":"刘晶鑫15","年龄":25},{"编号":16,"姓名":"刘晶鑫16","年龄":26},{"编号":17,"姓名":"刘晶鑫17","年龄":2},{"编号":18,"姓名":"刘晶鑫18","年龄":545},{"编号":19,"姓名":"刘晶鑫19","年龄":25656},{"编号":20,"姓名":"刘晶鑫20","年龄":5756},{"编号":21,"姓名":"刘晶鑫21","年龄":57565},{"编号":22,"姓名":"刘晶鑫22","年龄":450},{"编号":23,"姓名":"刘晶鑫23","年龄":3848384}],
        columns: ['编号', '姓名', '年龄'],
        showTableData: [],
      },
      pageData: {
        pageSize: 10,
        pageIndex: 1,
        totalCount: 0
      }
    }
  }

  mounted () {
    this.pageData.totalCount = this.tableData.allData.length
    this.fmtTableData()
  }

  clickSelcetFile () {
    this.$refs.selectFile.click()
  }

  // 选中文件
  async changeFile (e) {
    const fileFullName = e.target.files[0].name
    const fileSuffix = fileFullName.split('.')[1]
    if (fileSuffix !== 'xlsx') {
      return this.$message.error('只支持.xlsx文件')
    }
    this.fileName = fileFullName
    let files = e.target.files
    const res = await this.fmtReadFile(files)
    this.tableData.allData = res
    if (this.tableData.allData.length !== 0) {
      this.columns = Object.keys(this.tableData.allData[0])
    }
    // 初始化第一页
    this.pageData = Object.assign({}, {
      pageSize: 10,
      pageIndex: 1,
      totalCount: this.tableData.allData.length
    })
    this.fmtTableData()
    console.log(JSON.stringify(res))
    console.log(this.columns)
  }

  // 翻页
  handleCurrentChange (pageIndex) {
    this.pageData.pageIndex = pageIndex
    this.fmtTableData()
  }

  // 修改一页展示条数
  handleSizeChange (pageSize) {
    this.pageData.pageSize = pageSize
    this.pageData.pageIndex = 1
    this.fmtTableData()
  }

  // 处理表格展示的数据
  fmtTableData () {
    this.tableData.showTableData = []
    const begin = (this.pageData.pageIndex - 1) * this.pageData.pageSize
    const end = begin + this.pageData.pageSize
    this.tableData.showTableData = this.tableData.allData.slice(begin, end)
  }

  // 格式化文件
  fmtReadFile (files) {
    return new Promise ((resolve, reject) => {
      let fileReader = new FileReader()
      fileReader.onload = function(ev) {
        try {
            var data = ev.target.result,
                workbook = XLSX.read(data, {
                    type: 'binary'
                }), // 以二进制流方式读取得到整份excel表格对象
                persons = []; // 存储获取到的数据
        } catch (e) {
            this.$message.error('只支持.xlsx文件');
            reject('文件类型不正确')
        }

        // 表格的表格范围，可用于判断表头是否数量是否正确
        var fromTo = '';
        // 遍历每张表读取
        for (var sheet in workbook.Sheets) {
            if (workbook.Sheets.hasOwnProperty(sheet)) {
                fromTo = workbook.Sheets[sheet]['!ref'];
                persons = persons.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
                // break; // 如果只取第一张表，就取消注释这行
            }
        }
        resolve(persons)
      }
      // 以二进制方式打开文件
      fileReader.readAsBinaryString(files[0]);
    })
  }

  // 预览当前行
  viewRow (data) {
    console.log(data)
  }
  
  render () {
    return (
      <div class='excelToolTable'>
        <input
          v-show={false}
          ref='selectFile'
          type='file'
          id='excel-file'
          onChange={(e) => {
            this.changeFile(e)
          }}
        ></input>
        <el-card class='select-options'>
          <div slot="header" class="clearfix">
            <span>文件选项</span>
          </div>
          <el-form label-width="80px" class='select-file'>
            <el-form-item label='选中文件:'>
              <p>{this.fileName || '未选择文件'}</p>
            </el-form-item>
            <el-form-item>
              <el-button
                size="small"
                type='primary'
                onClick={() => {
                  this.clickSelcetFile()
                }}
              >选择文件</el-button>
            </el-form-item>
          </el-form>
          <el-form label-width="80px" class='select-options'>
            <el-form-item label='选中文件'>
              <el-input v-model={this.fileName} placeholder='请选择文件'></el-input>
            </el-form-item>
            <el-form-item>
              <el-button size="small" type='primary'>选择文件</el-button>
            </el-form-item>
          </el-form>
        </el-card>
        <el-card class='data-table'>
        <el-table
          data={this.tableData.showTableData}
          border
          style="width: 100%">
             <el-table-column
              type='index'
              width='50'>
            </el-table-column>
            {
              this.tableData.columns.map((item) => {
                return (
                  <el-table-column
                    prop={item}
                    label={item}
                  >
                  </el-table-column>
                )
              })
            }
            <el-table-column label="操作">
            {
              (prop) => (
                <el-button
                  type='text'
                  size='small'
                  onClick={() => {
                    this.viewRow(prop.row)
                  }}>
                  预览
                </el-button>
              )
            }
            </el-table-column>
          </el-table>
          <el-pagination
            onSize-change={(size) => this.handleSizeChange(size)}
            onCurrent-change={(pageIndex) => this.handleCurrentChange(pageIndex)}
            current-page={this.pageData.pageIndex}
            page-sizes={[10, 20, 30, 40]}
            page-size={10}
            layout="total, sizes, prev, pager, next, jumper"
            total={this.pageData.totalCount} />
        </el-card>
      </div>
    )
  }
}
