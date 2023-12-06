project_name: "employee"

# # Use local_dependency: To enable referencing of another project
# # on this instance with include: statements
#
# local_dependency: {
#   project: "name_of_other_project"
# }
constant: VIS_LABEL {
  value: "Employee Status Chart"
  export: override_optional
}

constant: VIS_ID {
  value: "custom_viz"
  export:  override_optional
}

visualization: {
  id: "Employee_status"
  file: "Visualization/employeeStatusChart.js"
  label: "Employee Status"
}
