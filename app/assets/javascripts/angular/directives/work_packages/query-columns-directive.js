//-- copyright
// OpenProject is a project management system.
// Copyright (C) 2012-2014 the OpenProject Foundation (OPF)
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License version 3.
//
// OpenProject is a fork of ChiliProject, which is a fork of Redmine. The copyright follows:
// Copyright (C) 2006-2013 Jean-Philippe Lang
// Copyright (C) 2010-2013 the ChiliProject Team
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License
// as published by the Free Software Foundation; either version 2
// of the License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
//
// See doc/COPYRIGHT.rdoc for more details.
//++

angular.module('openproject.workPackages.directives')

.directive('queryColumns', [
  'WorkPackagesTableHelper',
  'WorkPackageService',
  'QueryService',
  function(WorkPackagesTableHelper, WorkPackageService, QueryService) {

  return {
    restrict: 'E',
    replace: true,
    templateUrl: '/templates/work_packages/query_columns.html',
    compile: function(tElement) {
      return {
        pre: function(scope) {
          scope.showColumns = function(columnNames) {
            QueryService.showColumns(columnNames);

            extendRowsWithColumnData(columnNames); // TODO move to QueryService
          };

          scope.hideColumns = function(columnNames) {
            QueryService.hideColumns(columnNames);
          };

          scope.moveSelectedColumnBy = function(by) {
            var nameOfColumnToBeMoved = scope.markedSelectedColumns.first();
            WorkPackagesTableHelper.moveColumnBy(scope.columns, nameOfColumnToBeMoved, by);
          };

          // TODO move to WorkPackagesService
          function extendRowsWithColumnData(columnNames) {
            var workPackages = scope.rows.map(function(row) {
              return row.object;
            });
            var newColumns = WorkPackagesTableHelper.selectColumnsByName(scope.columns, columnNames);

            // work package rows
            var params = [workPackages, newColumns];
            if( scope.groupByColumn) params.push(scope.groupByColumn.name);
            scope.withLoading(WorkPackageService.augmentWorkPackagesWithColumnsData, params)
              .then(scope.updateBackUrl);
          }
        }
      };
    }
  };
}]);