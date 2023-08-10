function setupCalendar(hasId) {
   var myDates = [];
   for (var j = 0; j <= 11; j++) {
      myDates[j] = [];
   }
   $(function () {
      $(hasId).datepicker({
         showOtherMonths: true,
         selectOtherMonths: true,
         numberOfMonths: 1,
      });
      initCalendar()
   });
   function initCalendar() {
      var dateDragStart = undefined; // We'll use this variable to identify if the user is mouse button is pressed (if the user is dragging over the calendar)
      var thisDates = [];
      var calendarTds = $('.ui-datepicker-calendar td:not(.ui-datepicker-unselectable)');
      $(hasId + ' td').attr('data-event', '');
      $(hasId + ' td').attr('data-handler', '');
      $(hasId + ' td a').removeClass('ui-state-active');
      $(hasId + ' td a.ui-state-highlight').removeClass('ui-state-active').removeClass('ui-state-highlight').removeClass('ui-state-hover');
      $(hasId + ' td').off();
      for (let index = 0; index < myDates.length; index++) {
         const tempMonth = myDates[index];
         for (var i = 0; i < tempMonth.length; i++) { // Repaint
            for (let j = 0; j < calendarTds.length; j++) {
               //const element = calendarTds[j];
               var day = $(calendarTds[j]).find('a').text();
               var month = $(calendarTds[j]).attr('data-month');
               var year = $(calendarTds[j]).attr('data-year');
               var date = new Date(year, month, day);
               if (new Date(tempMonth[i]).getTime() == date.getTime()) {
                  $(calendarTds[j]).find('a').addClass('ui-state-active');
               }
            }
         }

      }

      $(hasId + ' td').mousedown(function () {  // Click or start of dragging
         dateDragStart = new Date($(this).attr('data-year'), $(this).attr('data-month'), $(this).find('a').html());
         $(this).find('a').toggleClass('ui-state-active');
         return false;
      });

      $(hasId + ' td').mouseup(function () {
         thisDates = [];
         $(hasId + ' td a').each(function () { //Save selected dates
            var day = $(this).text();
            var month = $(this).parent().attr('data-month');
            var year = $(this).parent().attr('data-year');
            var date = new Date(year, month, day);
            var monthArray = myDates[month];
            if ($(this).hasClass('ui-state-active')) {
               monthArray.push(date);
            } else {
               let isFound = false;
               let id;
               for (let index = 0; index < monthArray.length; index++) {
                  var newDate = monthArray[index];
                  if (newDate.getTime() == date.getTime()) {
                     isFound = true;
                     id = index;
                  }

               }
               if (isFound) {
                  monthArray.splice(id, 1);
               }
            }

         });
         for (let index = 0; index < myDates.length; index++) {
            var arrayWithDuplicates = myDates[index];
            var uniqueArray = arrayWithDuplicates.filter((value, index, self) => {
               const dateString = value.getTime(); // Convert date to a string for comparison
               return self.findIndex(obj => obj.getTime() === dateString) === index;
            });
            myDates[index] = uniqueArray;
         }
         dateDragStart = undefined;
         return false;
      });
      $(document).mouseup(function () {
         dateDragStart = undefined;
      });

      $(hasId + ' td').mouseenter(function () {  // Drag over day on calendar
         var thisDate = new Date($(this).attr('data-year'), $(this).attr('data-month'), $(this).find('a').html());
         if (dateDragStart !== undefined && thisDate > dateDragStart) {
            $(this).find('a').toggleClass('ui-state-active');
         } else if (dateDragStart !== undefined && thisDate < dateDragStart) {
            $(this).find('a').toggleClass('ui-state-active');
         }
      });
      $('a.ui-datepicker-next, a.ui-datepicker-prev').click(function () {
         initCalendar();
      });
   }
}
setupCalendar('#calendar');

