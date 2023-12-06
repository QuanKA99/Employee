view: employee {
  sql_table_name: `Employee.employee` ;;

  dimension: employee_status {
    type: string
    sql: ${TABLE}.employee_status ;;
  }
  dimension: job_level {
    type: string
    sql: ${TABLE}.job_level ;;
  }
  measure: count {
    type: count
  }
}
