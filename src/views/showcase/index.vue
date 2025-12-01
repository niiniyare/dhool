<template>
  <div class="min-h-screen surface-ground">
    <div class="surface-0 p-6 border-bottom-1 surface-border">
      <div class="max-w-6xl mx-auto">
        <h1 class="text-4xl font-bold text-900 mb-3">PrimeVue 4 Component Showcase</h1>
        <p class="text-600 text-lg">Explore all PrimeVue 4 components with proper usage patterns</p>
      </div>
    </div>
    
    <div class="max-w-6xl mx-auto p-6">

    <TabView class="mt-6">
      <TabPanel value="0" header="Forms">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
          <!-- Buttons -->
          <Card class="h-fit">
            <template #title>
              <i class="pi pi-click mr-2"></i>
              Buttons
            </template>
            <template #content>
              <div class="space-y-4">
                <div class="flex flex-wrap gap-3 mb-4">
                  <Button label="Primary" />
                  <Button label="Secondary" severity="secondary" />
                  <Button label="Success" severity="success" />
                  <Button label="Info" severity="info" />
                  <Button label="Warning" severity="warn" />
                  <Button label="Help" severity="help" />
                  <Button label="Danger" severity="danger" />
                  <Button label="Contrast" severity="contrast" />
                </div>
                <div class="flex flex-wrap gap-3 mb-4">
                  <Button label="Outlined" variant="outlined" />
                  <Button label="Text" variant="text" />
                  <Button label="Link" variant="link" />
                  <Button label="Raised" raised />
                  <Button label="Rounded" rounded />
                </div>
                <div class="flex flex-wrap gap-3 mb-4">
                  <Button icon="pi pi-check" aria-label="Check" />
                  <Button icon="pi pi-check" label="Icon Left" />
                  <Button icon="pi pi-check" label="Icon Right" iconPos="right" />
                  <Button icon="pi pi-refresh" label="Loading" :loading="buttonLoading" @click="toggleLoading" />
                </div>
                <div class="flex flex-wrap gap-3">
                  <Button label="Small" size="small" />
                  <Button label="Normal" />
                  <Button label="Large" size="large" />
                  <Button label="Badge" badge="3" />
                  <Button label="Messages" icon="pi pi-envelope" badge="5" badgeSeverity="danger" />
                </div>
              </div>
            </template>
          </Card>

          <!-- Input Components -->
          <Card class="h-fit">
            <template #title>
              <i class="pi pi-pencil mr-2"></i>
              Input Components
            </template>
            <template #content>
              <div class="space-y-4">
                <div class="flex flex-col gap-2">
                  <label class="font-medium">InputText</label>
                  <div class="flex gap-2">
                    <InputText v-model="formData.text" placeholder="Default" />
                    <InputText v-model="formData.textFilled" placeholder="Filled" variant="filled" />
                  </div>
                </div>
                <div class="flex flex-col gap-2">
                  <label class="font-medium">Password</label>
                  <div class="flex gap-2">
                    <Password v-model="formData.password" placeholder="Password" toggleMask />
                    <Password v-model="formData.passwordFilled" placeholder="With feedback" variant="filled" :feedback="true" />
                  </div>
                </div>
                <div class="flex flex-col gap-2">
                  <label class="font-medium">Textarea</label>
                  <Textarea v-model="formData.textarea" placeholder="Enter description" rows="3" autoResize />
                </div>
                <div class="flex flex-col gap-2">
                  <label class="font-medium">Sizes</label>
                  <div class="flex gap-2 align-items-end">
                    <InputText v-model="formData.textSmall" placeholder="Small" size="small" />
                    <InputText v-model="formData.textNormal" placeholder="Normal" />
                    <InputText v-model="formData.textLarge" placeholder="Large" size="large" />
                  </div>
                </div>
              </div>
            </template>
          </Card>

          <!-- Select Components -->
          <Card class="h-fit">
            <template #title>
              <i class="pi pi-list mr-2"></i>
              Selection
            </template>
            <template #content>
              <div class="space-y-4">
                <div class="flex flex-col gap-2">
                  <label class="font-medium">Select</label>
                  <Select 
                    v-model="formData.selectedCity" 
                    :options="cities" 
                    optionLabel="name" 
                    optionValue="code"
                    placeholder="Select a City" 
                    showClear
                    class="w-full"
                  />
                </div>
                <div class="flex flex-col gap-2">
                  <label class="font-medium">MultiSelect</label>
                  <MultiSelect 
                    v-model="formData.selectedCities" 
                    :options="cities" 
                    optionLabel="name" 
                    optionValue="code"
                    placeholder="Select Cities" 
                    :maxSelectedLabels="2" 
                    showClear
                    class="w-full"
                  />
                </div>
                <div class="flex flex-col gap-2">
                  <label class="font-medium">AutoComplete</label>
                  <AutoComplete 
                    v-model="formData.selectedCountry" 
                    :suggestions="filteredCountries" 
                    @complete="searchCountry" 
                    placeholder="Search countries"
                    showClear
                  />
                </div>
                <div class="flex flex-col gap-2">
                  <label class="font-medium">Select with Filter</label>
                  <Select 
                    v-model="formData.selectedCityFiltered" 
                    :options="cities" 
                    optionLabel="name" 
                    optionValue="code"
                    placeholder="Filterable Select" 
                    filter
                    showClear
                    class="w-full"
                  />
                </div>
              </div>
            </template>
          </Card>

          <!-- Date and Numbers -->
          <Card class="h-fit">
            <template #title>
              <i class="pi pi-calendar mr-2"></i>
              Date & Numbers
            </template>
            <template #content>
              <div class="space-y-4">
                <div class="flex flex-col gap-2">
                  <label class="font-medium">DatePicker</label>
                  <div class="flex gap-2">
                    <DatePicker v-model="formData.date" showIcon placeholder="Select date" dateFormat="mm/dd/yy" />
                    <DatePicker v-model="formData.dateTime" showIcon showTime placeholder="Date & Time" />
                  </div>
                </div>
                <div class="flex flex-col gap-2">
                  <label class="font-medium">InputNumber</label>
                  <div class="flex gap-2">
                    <InputNumber v-model="formData.number" placeholder="Basic" />
                    <InputNumber v-model="formData.numberButtons" showButtons placeholder="With buttons" />
                    <InputNumber v-model="formData.currency" mode="currency" currency="USD" locale="en-US" placeholder="Currency" />
                  </div>
                </div>
                <div class="flex flex-col gap-2">
                  <label class="font-medium">Slider</label>
                  <Slider v-model="formData.slider" :min="0" :max="100" />
                  <div class="text-center text-sm text-600">Value: {{ formData.slider }}</div>
                </div>
                <div class="flex flex-col gap-2">
                  <label class="font-medium">Range Slider</label>
                  <Slider v-model="formData.rangeValues" range :min="0" :max="100" />
                  <div class="text-center text-sm text-600">Range: {{ formData.rangeValues }}</div>
                </div>
              </div>
            </template>
          </Card>

          <!-- Toggle Components -->
          <Card class="h-fit">
            <template #title>
              <i class="pi pi-toggle-on mr-2"></i>
              Toggles
            </template>
            <template #content>
              <div class="space-y-4">
                <div class="flex flex-col gap-3">
                  <label class="font-medium">InputSwitch</label>
                  <div class="flex items-center gap-3">
                    <InputSwitch v-model="formData.switch" />
                    <label>Basic Switch</label>
                  </div>
                  <div class="flex items-center gap-3">
                    <InputSwitch v-model="formData.switchDisabled" disabled />
                    <label class="text-surface-500">Disabled Switch</label>
                  </div>
                </div>
                <div class="flex flex-col gap-3">
                  <label class="font-medium">Checkbox</label>
                  <div class="flex items-center gap-3">
                    <Checkbox v-model="formData.checkbox" binary />
                    <label>Basic Checkbox</label>
                  </div>
                  <div class="flex items-center gap-3">
                    <Checkbox v-model="formData.checkboxes" inputId="cb1" value="New York" />
                    <label for="cb1">New York</label>
                  </div>
                  <div class="flex items-center gap-3">
                    <Checkbox v-model="formData.checkboxes" inputId="cb2" value="San Francisco" />
                    <label for="cb2">San Francisco</label>
                  </div>
                </div>
                <div class="flex flex-col gap-3">
                  <label class="font-medium">RadioButton</label>
                  <div class="flex flex-col gap-2">
                    <div class="flex items-center gap-2">
                      <RadioButton v-model="formData.radio" inputId="option1" value="Option 1" />
                      <label for="option1">Option 1</label>
                    </div>
                    <div class="flex items-center gap-2">
                      <RadioButton v-model="formData.radio" inputId="option2" value="Option 2" />
                      <label for="option2">Option 2</label>
                    </div>
                    <div class="flex items-center gap-2">
                      <RadioButton v-model="formData.radio" inputId="option3" value="Option 3" />
                      <label for="option3">Option 3</label>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </Card>

          <!-- File Upload -->
          <Card class="h-fit">
            <template #title>
              <i class="pi pi-upload mr-2"></i>
              File Upload
            </template>
            <template #content>
              <FileUpload mode="basic" name="demo" accept="image/*" :maxFileSize="1000000" />
            </template>
          </Card>

          <!-- Button Group -->
          <Card class="h-fit">
            <template #title>
              <i class="pi pi-objects-column mr-2"></i>
              Button Group
            </template>
            <template #content>
              <div class="space-y-4">
                <ButtonGroup>
                  <Button label="Save" icon="pi pi-check" />
                  <Button label="Edit" icon="pi pi-pencil" />
                  <Button label="Delete" icon="pi pi-trash" />
                </ButtonGroup>
                <ButtonGroup>
                  <Button icon="pi pi-align-left" aria-label="Left Align" />
                  <Button icon="pi pi-align-center" aria-label="Center Align" />
                  <Button icon="pi pi-align-right" aria-label="Right Align" />
                  <Button icon="pi pi-align-justify" aria-label="Justify" />
                </ButtonGroup>
              </div>
            </template>
          </Card>
        </div>
      </TabPanel>

      <TabPanel value="1" header="Data">
        <div class="space-y-8 mt-6">
          <!-- DataTable -->
          <Card>
            <template #title>
              <i class="pi pi-table mr-2"></i>
              DataTable
            </template>
            <template #content>
            <DataTable 
              :value="customers" 
              paginator 
              :rows="5" 
              :rowsPerPageOptions="[5, 10, 15]"
              sortMode="multiple"
              removableSort
              selectionMode="single"
              v-model:selection="selectedCustomer"
              :globalFilterFields="['name', 'country.name', 'representative.name', 'status']"
              showGridlines
              stripedRows
            >
              <template #header>
                <div class="flex flex-wrap gap-2 justify-between items-center">
                  <div class="flex gap-2">
                    <Button icon="pi pi-filter-slash" label="Clear" severity="secondary" @click="clearFilter()" />
                    <Button icon="pi pi-external-link" label="Export" severity="help" @click="exportCSV($event)" />
                  </div>
                  <IconField>
                    <InputIcon>
                      <i class="pi pi-search" />
                    </InputIcon>
                    <InputText v-model="filters.global.value" placeholder="Global Search" />
                  </IconField>
                </div>
              </template>
              <Column selectionMode="single" headerStyle="width: 3rem"></Column>
              <Column field="name" header="Name" sortable style="min-width: 14rem">
                <template #body="{ data }">
                  <div class="flex items-center gap-2">
                    <Avatar :label="data.name.charAt(0)" shape="circle" />
                    <span class="font-medium">{{ data.name }}</span>
                  </div>
                </template>
              </Column>
              <Column field="country.name" header="Country" sortable style="min-width: 10rem">
                <template #body="{ data }">
                  <div class="flex items-center gap-2">
                    <img :alt="data.country.name" src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png" class="w-6" />
                    <span>{{ data.country.name }}</span>
                  </div>
                </template>
                <template #filter="{ filterModel }">
                  <InputText v-model="filterModel.value" type="text" placeholder="Search by country" />
                </template>
              </Column>
              <Column field="representative.name" header="Representative" sortable style="min-width: 14rem">
                <template #body="{ data }">
                  <div class="flex items-center gap-2">
                    <Avatar :label="data.representative.name.charAt(0)" shape="circle" />
                    <span>{{ data.representative.name }}</span>
                  </div>
                </template>
              </Column>
              <Column field="status" header="Status" sortable style="min-width: 10rem">
                <template #body="{ data }">
                  <Tag :value="data.status" :severity="getStatusSeverity(data.status)" />
                </template>
              </Column>
              <Column header="Actions" style="min-width: 8rem">
                <template #body="{ data }">
                  <div class="flex gap-2">
                    <Button icon="pi pi-pencil" severity="info" @click="editCustomer(data)" size="small" text rounded aria-label="Edit" />
                    <Button icon="pi pi-trash" severity="danger" @click="deleteCustomer(data)" size="small" text rounded aria-label="Delete" />
                  </div>
                </template>
              </Column>
            </DataTable>
            </template>
          </Card>

          <!-- TreeTable -->
          <Card>
            <template #title>
              <i class="pi pi-sitemap mr-2"></i>
              TreeTable
            </template>
            <template #content>
            <TreeTable 
              :value="treeNodes" 
              paginator 
              :rows="10" 
              :rowsPerPageOptions="[5, 10, 20]"
              selectionMode="single"
              v-model:selectionKeys="selectedNodeKey"
              showGridlines
            >
              <Column field="name" header="Name" :expander="true" style="min-width: 12rem">
                <template #body="{ node }">
                  <div class="flex items-center gap-2">
                    <i :class="node.data.type === 'Folder' ? 'pi pi-folder text-amber-500' : 'pi pi-file text-blue-500'"></i>
                    <span>{{ node.data.name }}</span>
                  </div>
                </template>
              </Column>
              <Column field="size" header="Size" style="min-width: 8rem">
                <template #body="{ node }">
                  <span class="text-sm">{{ node.data.size }}</span>
                </template>
              </Column>
              <Column field="type" header="Type" style="min-width: 10rem">
                <template #body="{ node }">
                  <Tag :value="node.data.type" :severity="node.data.type === 'Folder' ? 'warn' : 'info'" />
                </template>
              </Column>
              <Column header="Actions" style="min-width: 8rem">
                <template #body="{ node }">
                  <div class="flex gap-1">
                    <Button icon="pi pi-eye" size="small" text rounded severity="help" aria-label="View" />
                    <Button icon="pi pi-download" size="small" text rounded severity="success" aria-label="Download" />
                  </div>
                </template>
              </Column>
            </TreeTable>
            </template>
          </Card>

          <!-- DataView -->
          <Card>
            <template #title>
              <i class="pi pi-th-large mr-2"></i>
              DataView
            </template>
            <template #content>
            <DataView 
              :value="products" 
              layout="grid"
              paginator
              :rows="6"
              :rowsPerPageOptions="[6, 12, 18]"
            >
              <template #header>
                <div class="flex justify-between items-center">
                  <h3 class="text-lg font-semibold">Products</h3>
                  <DataViewLayoutOptions v-model="layout" />
                </div>
              </template>
              <template #grid="slotProps">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div v-for="item in slotProps.items" :key="item.id" class="border border-surface-200 dark:border-surface-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div class="flex flex-col items-center gap-3">
                      <div class="relative">
                        <img class="w-32 h-32 object-cover rounded-lg" :src="`https://primefaces.org/cdn/primevue/images/product/${item.image}`" :alt="item.name" />
                        <Tag v-if="item.inventoryStatus === 'LOWSTOCK'" value="Low Stock" severity="warn" class="absolute top-2 left-2" />
                        <Tag v-else-if="item.inventoryStatus === 'OUTOFSTOCK'" value="Out of Stock" severity="danger" class="absolute top-2 left-2" />
                      </div>
                      <div class="text-center">
                        <div class="text-lg font-semibold mb-2">{{ item.name }}</div>
                        <div class="text-sm text-surface-600 mb-2">{{ item.category }}</div>
                        <div class="flex items-center gap-2 mb-3">
                          <Rating :modelValue="item.rating" readonly :cancel="false" />
                          <span class="text-sm text-surface-500">({{ item.rating }})</span>
                        </div>
                        <div class="text-2xl font-bold text-primary mb-3">${{ item.price }}</div>
                        <div class="flex gap-2 justify-center">
                          <Button 
                            label="Add to Cart" 
                            icon="pi pi-shopping-cart" 
                            severity="primary"
                            :disabled="item.inventoryStatus === 'OUTOFSTOCK'"
                            @click="addToCart(item)"
                          />
                          <Button 
                            icon="pi pi-heart" 
                            severity="secondary" 
                            outlined
                            @click="addToWishlist(item)"
                            aria-label="Add to Wishlist"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              <template #list="slotProps">
                <div class="flex flex-col gap-4">
                  <div v-for="(item, index) in slotProps.items" :key="item.id" class="flex items-center gap-4 p-4 border border-surface-200 dark:border-surface-700 rounded-lg">
                    <img class="w-16 h-16 object-cover rounded" :src="`https://primefaces.org/cdn/primevue/images/product/${item.image}`" :alt="item.name" />
                    <div class="flex-1">
                      <div class="font-semibold text-lg">{{ item.name }}</div>
                      <div class="text-surface-600">{{ item.category }}</div>
                      <Rating :modelValue="item.rating" readonly :cancel="false" class="mt-1" />
                    </div>
                    <div class="text-2xl font-bold text-primary">${{ item.price }}</div>
                    <Button 
                      label="Add to Cart" 
                      icon="pi pi-shopping-cart" 
                      :disabled="item.inventoryStatus === 'OUTOFSTOCK'"
                      @click="addToCart(item)"
                    />
                  </div>
                </div>
              </template>
            </DataView>
            </template>
          </Card>
        </div>
      </TabPanel>

      <TabPanel value="2" header="Feedback">
        <div class="space-y-8 mt-6">
          <!-- Messages -->
          <Card>
            <template #title>
              <i class="pi pi-info-circle mr-2"></i>
              Messages
            </template>
            <template #content>
              <div class="space-y-3">
                <Message severity="success" size="large">Operation completed successfully!</Message>
                <Message severity="info" :closable="true">Here is some important information for you.</Message>
                <Message severity="warn" icon="pi pi-exclamation-triangle">Please review your settings before proceeding.</Message>
                <Message severity="error" variant="outlined">An error occurred while processing your request.</Message>
                <Message severity="secondary">This is a neutral message with secondary styling.</Message>
                <Message severity="contrast" size="small">Contrast message for better visibility.</Message>
              </div>
            </template>
          </Card>

          <!-- Toast Triggers -->
          <Card>
            <template #title>
              <i class="pi pi-bell mr-2"></i>
              Toast Notifications
            </template>
            <template #content>
              <div class="flex flex-wrap gap-3">
                <Button label="Success" severity="success" @click="showToast('success', 'Success!', 'Operation completed successfully', 5000)" />
                <Button label="Info" severity="info" @click="showToast('info', 'Information', 'Here is some important information', 4000)" />
                <Button label="Warning" severity="warn" @click="showToast('warn', 'Warning!', 'Please be careful with this action', 6000)" />
                <Button label="Error" severity="danger" @click="showToast('error', 'Error!', 'Something went wrong, please try again', 7000)" />
                <Button label="Contrast" severity="contrast" @click="showToast('contrast', 'Contrast!', 'High contrast message for accessibility', 3000)" />
                <Button label="Secondary" severity="secondary" @click="showToast('secondary', 'Secondary', 'Secondary level notification', 3000)" />
              </div>
            </template>
          </Card>

          <!-- Dialogs -->
          <Card>
            <template #title>
              <i class="pi pi-window-maximize mr-2"></i>
              Dialogs
            </template>
            <template #content>
              <div class="flex flex-wrap gap-3">
                <Button label="Show Dialog" @click="showDialog = true" />
                <Button label="Confirmation" severity="warn" @click="confirmDialog()" />
                <Button label="Delete Confirmation" severity="danger" @click="confirmDelete()" />
              </div>
            </template>
          </Card>

          <!-- Progress -->
          <Card>
            <template #title>
              <i class="pi pi-spinner mr-2"></i>
              Progress
            </template>
            <template #content>
              <div class="space-y-4">
                <div>
                  <label class="block mb-2 font-medium">ProgressBar</label>
                  <div class="space-y-3">
                    <ProgressBar :value="progressValue" />
                    <ProgressBar :value="75" showValue color="#10b981" />
                    <ProgressBar :value="progressValue" mode="indeterminate" style="height: 6px" />
                  </div>
                </div>
                <div>
                  <label class="block mb-2 font-medium">ProgressSpinner</label>
                  <div class="flex gap-4 items-center">
                    <ProgressSpinner />
                    <ProgressSpinner style="width: 30px; height: 30px" strokeWidth="4" animationDuration="1s" />
                    <ProgressSpinner style="width: 60px; height: 60px" strokeWidth="8" fill="var(--p-surface-ground)" animationDuration=".8s" />
                  </div>
                </div>
              </div>
            </template>
          </Card>

          <!-- Skeleton -->
          <Card>
            <template #title>
              <i class="pi pi-bars mr-2"></i>
              Skeleton
            </template>
            <template #content>
              <div class="space-y-4">
                <div>
                  <label class="block mb-2 font-medium">Text Skeleton</label>
                  <div class="space-y-2">
                    <Skeleton height="2rem" />
                    <Skeleton height="1rem" width="70%" />
                    <Skeleton height="1rem" width="50%" />
                  </div>
                </div>
                <div>
                  <label class="block mb-2 font-medium">Card Skeleton</label>
                  <div class="border border-surface-200 p-4 rounded">
                    <div class="flex items-center gap-4">
                      <Skeleton shape="circle" size="4rem" />
                      <div class="flex-1">
                        <Skeleton width="100%" height="1.5rem" />
                        <Skeleton width="75%" height="1rem" class="mt-2" />
                      </div>
                    </div>
                    <Skeleton width="100%" height="8rem" class="mt-4" borderRadius="8px" />
                  </div>
                </div>
              </div>
            </template>
          </Card>
        </div>

        <!-- Dialog Component -->
        <Dialog v-model:visible="showDialog" modal header="Sample Dialog" :style="{ width: '25rem' }">
          <span class="text-surface-500 dark:text-surface-400 block mb-8">This is a sample dialog content.</span>
          <div class="flex justify-end gap-2">
            <Button type="button" label="Cancel" severity="secondary" @click="showDialog = false"></Button>
            <Button type="button" label="Save" @click="showDialog = false"></Button>
          </div>
        </Dialog>
      </TabPanel>

      <TabPanel value="3" header="Navigation">
        <div class="space-y-8 mt-6">
          <!-- Menu -->
          <Card>
            <template #title>
              <i class="pi pi-bars mr-2"></i>
              Menu
            </template>
            <template #content>
              <div class="flex gap-4">
                <div>
                  <h4 class="text-sm font-medium mb-2">Basic Menu</h4>
                  <Menu :model="menuItems" />
                </div>
                <div>
                  <h4 class="text-sm font-medium mb-2">Popup Menu</h4>
                  <Button type="button" icon="pi pi-ellipsis-v" @click="toggleMenu" aria-haspopup="true" aria-controls="overlay_menu" />
                  <Menu ref="menu" id="overlay_menu" :model="contextMenuItems" :popup="true" />
                </div>
              </div>
            </template>
          </Card>

          <!-- Breadcrumb -->
          <Card>
            <template #title>
              <i class="pi pi-angle-right mr-2"></i>
              Breadcrumb
            </template>
            <template #content>
              <div class="space-y-4">
                <div>
                  <h4 class="text-sm font-medium mb-2">Basic Breadcrumb</h4>
                  <Breadcrumb :home="home" :model="breadcrumbItems" />
                </div>
                <div>
                  <h4 class="text-sm font-medium mb-2">Custom Separator</h4>
                  <Breadcrumb :home="home" :model="breadcrumbItems">
                    <template #separator> / </template>
                  </Breadcrumb>
                </div>
              </div>
            </template>
          </Card>

          <!-- Steps -->
          <Card>
            <template #title>
              <i class="pi pi-list-check mr-2"></i>
              Steps
            </template>
            <template #content>
              <div class="space-y-4">
                <div>
                  <h4 class="text-sm font-medium mb-2">Interactive Steps</h4>
                  <Steps v-model:value="activeStep" :model="stepItems" />
                </div>
                <div class="flex gap-2 mt-4">
                  <Button label="Previous" icon="pi pi-angle-left" @click="prevStep" :disabled="activeStep === 0" severity="secondary" />
                  <Button label="Next" icon="pi pi-angle-right" iconPos="right" @click="nextStep" :disabled="activeStep === stepItems.length - 1" />
                </div>
              </div>
            </template>
          </Card>

          <!-- TabMenu -->
          <Card>
            <template #title>
              <i class="pi pi-clone mr-2"></i>
              TabMenu
            </template>
            <template #content>
              <div class="space-y-4">
                <TabMenu v-model:value="activeTabIndex" :model="tabMenuItems" />
                <div class="p-4 border border-surface-200 rounded">
                  <div v-if="activeTabIndex === 0">
                    <h3 class="text-lg font-semibold mb-2">Dashboard Content</h3>
                    <p class="text-surface-600">Welcome to your dashboard overview.</p>
                  </div>
                  <div v-else-if="activeTabIndex === 1">
                    <h3 class="text-lg font-semibold mb-2">Transactions</h3>
                    <p class="text-surface-600">View your recent transactions here.</p>
                  </div>
                  <div v-else-if="activeTabIndex === 2">
                    <h3 class="text-lg font-semibold mb-2">Products</h3>
                    <p class="text-surface-600">Manage your product catalog.</p>
                  </div>
                  <div v-else>
                    <h3 class="text-lg font-semibold mb-2">Messages</h3>
                    <p class="text-surface-600">Check your inbox for new messages.</p>
                  </div>
                </div>
              </div>
            </template>
          </Card>

          <!-- Dock -->
          <Card>
            <template #title>
              <i class="pi pi-desktop mr-2"></i>
              Dock
            </template>
            <template #content>
              <div class="flex justify-center p-4">
                <Dock :model="dockItems" position="bottom">
                  <template #item="{ item }">
                    <div class="flex flex-col items-center gap-1 p-2">
                      <img :src="item.icon" :alt="item.label" class="w-8 h-8" />
                      <span class="text-xs">{{ item.label }}</span>
                    </div>
                  </template>
                </Dock>
              </div>
            </template>
          </Card>
        </div>
      </TabPanel>
    </TabView>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import { FilterMatchMode } from '@primevue/core/api'

const toast = useToast()
const confirm = useConfirm()

// Form data
const formData = ref({
  text: '',
  textFilled: '',
  textSmall: '',
  textNormal: '',
  textLarge: '',
  password: '',
  passwordFilled: '',
  textarea: '',
  selectedCity: null,
  selectedCities: [],
  selectedCityFiltered: null,
  selectedCountry: null,
  date: null,
  dateTime: null,
  number: null,
  numberButtons: null,
  currency: null,
  slider: 50,
  rangeValues: [20, 80],
  switch: false,
  switchDisabled: false,
  checkbox: false,
  checkboxes: [],
  radio: 'Option 1'
})

// Dialog state
const showDialog = ref(false)
const progressValue = ref(60)
const buttonLoading = ref(false)
const selectedCustomer = ref(null)
const selectedNodeKey = ref(null)
const layout = ref('grid')
const activeStep = ref(0)
const activeTabIndex = ref(0)
const menu = ref(null)

// Select options
const cities = ref([
  { name: 'New York', code: 'NY' },
  { name: 'Rome', code: 'RM' },
  { name: 'London', code: 'LDN' },
  { name: 'Istanbul', code: 'IST' },
  { name: 'Paris', code: 'PRS' }
])

const countries = ref(['Australia', 'Brazil', 'China', 'Egypt', 'France', 'Germany', 'India', 'Japan', 'Spain', 'United States'])
const filteredCountries = ref([])

// DataTable data
const customers = ref([
  {
    id: 1000,
    name: 'James Butt',
    country: { name: 'Algeria', code: 'dz' },
    representative: { name: 'Ioni Bowcher', image: 'ionibowcher.png' },
    status: 'qualified'
  },
  {
    id: 1001,
    name: 'Josephine Darakjy',
    country: { name: 'Egypt', code: 'eg' },
    representative: { name: 'Amy Elsner', image: 'amyelsner.png' },
    status: 'unqualified'
  },
  {
    id: 1002,
    name: 'Art Venere',
    country: { name: 'Panama', code: 'pa' },
    representative: { name: 'Asiya Javayant', image: 'asiyajavayant.png' },
    status: 'negotiation'
  }
])

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
})

// TreeTable data
const treeNodes = ref([
  {
    key: '0',
    data: { name: 'Applications', size: '100kb', type: 'Folder' },
    children: [
      { key: '0-0', data: { name: 'Vue', size: '25kb', type: 'Folder' } },
      { key: '0-1', data: { name: 'Angular', size: '75kb', type: 'Folder' } }
    ]
  },
  {
    key: '1',
    data: { name: 'Documents', size: '75kb', type: 'Folder' },
    children: [
      { key: '1-0', data: { name: 'Work', size: '55kb', type: 'Folder' } },
      { key: '1-1', data: { name: 'Home', size: '20kb', type: 'Folder' } }
    ]
  }
])

// Products for DataView
const products = ref([
  { 
    id: '1000', 
    name: 'Bamboo Watch', 
    price: 65, 
    category: 'Accessories',
    rating: 4.5,
    inventoryStatus: 'INSTOCK',
    image: 'bamboo-watch.jpg' 
  },
  { 
    id: '1001', 
    name: 'Black Watch', 
    price: 72, 
    category: 'Accessories',
    rating: 4.2,
    inventoryStatus: 'LOWSTOCK',
    image: 'black-watch.jpg' 
  },
  { 
    id: '1002', 
    name: 'Blue Band', 
    price: 79, 
    category: 'Fitness',
    rating: 4.8,
    inventoryStatus: 'INSTOCK',
    image: 'blue-band.jpg' 
  },
  { 
    id: '1003', 
    name: 'Gaming Set', 
    price: 299, 
    category: 'Electronics',
    rating: 4.7,
    inventoryStatus: 'OUTOFSTOCK',
    image: 'gaming-set.jpg' 
  },
  { 
    id: '1004', 
    name: 'Gold Headphones', 
    price: 149, 
    category: 'Electronics',
    rating: 4.3,
    inventoryStatus: 'INSTOCK',
    image: 'gold-phone-case.jpg' 
  },
  { 
    id: '1005', 
    name: 'Green Earbuds', 
    price: 89, 
    category: 'Electronics',
    rating: 4.1,
    inventoryStatus: 'INSTOCK',
    image: 'green-earbuds.jpg' 
  }
])

// Navigation items
const home = ref({ icon: 'pi pi-home', to: '/' })

const menuItems = ref([
  {
    label: 'File',
    icon: 'pi pi-file',
    items: [
      { label: 'New', icon: 'pi pi-plus', shortcut: '⌘+N' },
      { label: 'Open', icon: 'pi pi-download', shortcut: '⌘+O' },
      { separator: true },
      { label: 'Quit', icon: 'pi pi-times' }
    ]
  },
  {
    label: 'Edit',
    icon: 'pi pi-pencil',
    items: [
      { label: 'Cut', icon: 'pi pi-scissors', shortcut: '⌘+X' },
      { label: 'Copy', icon: 'pi pi-copy', shortcut: '⌘+C' },
      { label: 'Paste', icon: 'pi pi-clipboard', shortcut: '⌘+V' }
    ]
  },
  { separator: true },
  { label: 'Settings', icon: 'pi pi-cog' },
  { label: 'Help', icon: 'pi pi-question-circle' }
])

const contextMenuItems = ref([
  { label: 'View', icon: 'pi pi-search' },
  { label: 'Delete', icon: 'pi pi-times' },
  { separator: true },
  { label: 'Export', icon: 'pi pi-external-link' }
])

const breadcrumbItems = ref([
  { label: 'Computer', to: '/computer' },
  { label: 'Notebook', to: '/computer/notebook' },
  { label: 'Accessories', to: '/computer/notebook/accessories' },
  { label: 'Backpacks', to: '/computer/notebook/accessories/backpacks' },
  { label: 'Item', to: '/computer/notebook/accessories/backpacks/item' }
])

const stepItems = ref([
  { 
    value: '1',
    label: 'Personal Info',
    icon: 'pi pi-user'
  },
  { 
    value: '2',
    label: 'Address',
    icon: 'pi pi-map-marker'
  },
  { 
    value: '3', 
    label: 'Payment',
    icon: 'pi pi-credit-card'
  },
  { 
    value: '4',
    label: 'Confirmation',
    icon: 'pi pi-check'
  }
])

const tabMenuItems = ref([
  { 
    value: '0',
    label: 'Dashboard', 
    icon: 'pi pi-home'
  },
  { 
    value: '1',
    label: 'Transactions', 
    icon: 'pi pi-chart-line'
  },
  { 
    value: '2',
    label: 'Products', 
    icon: 'pi pi-list'
  },
  { 
    value: '3',
    label: 'Messages', 
    icon: 'pi pi-inbox'
  }
])

const dockItems = ref([
  { label: 'Finder', icon: 'https://primefaces.org/cdn/primevue/images/dock/finder.svg' },
  { label: 'App Store', icon: 'https://primefaces.org/cdn/primevue/images/dock/appstore.svg' },
  { label: 'Photos', icon: 'https://primefaces.org/cdn/primevue/images/dock/photos.svg' },
  { label: 'Trash', icon: 'https://primefaces.org/cdn/primevue/images/dock/trash.png' }
])

// Methods
const searchCountry = (event: any) => {
  setTimeout(() => {
    if (!event.query.trim().length) {
      filteredCountries.value = [...countries.value]
    } else {
      filteredCountries.value = countries.value.filter((country) => {
        return country.toLowerCase().startsWith(event.query.toLowerCase())
      })
    }
  }, 250)
}

const clearFilter = () => {
  filters.value.global.value = null
}

const getStatusSeverity = (status: string) => {
  switch (status) {
    case 'qualified':
      return 'success'
    case 'unqualified':
      return 'danger'
    case 'negotiation':
      return 'warn'
    case 'new':
      return 'info'
    default:
      return null
  }
}

const showToast = (severity: string, summary: string, detail: string, life: number = 3000) => {
  toast.add({ severity, summary, detail, life })
}

const toggleLoading = () => {
  buttonLoading.value = true
  setTimeout(() => {
    buttonLoading.value = false
  }, 2000)
}

const confirmDialog = () => {
  confirm.require({
    message: 'Are you sure you want to proceed?',
    header: 'Confirmation',
    icon: 'pi pi-exclamation-triangle',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true
    },
    acceptProps: {
      label: 'Save'
    },
    accept: () => {
      toast.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 })
    },
    reject: () => {
      toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 })
    }
  })
}

const confirmDelete = () => {
  confirm.require({
    message: 'Do you want to delete this record?',
    header: 'Delete Confirmation',
    icon: 'pi pi-info-circle',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true
    },
    acceptProps: {
      label: 'Delete',
      severity: 'danger'
    },
    accept: () => {
      toast.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted', life: 3000 })
    },
    reject: () => {
      toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 })
    }
  })
}

// Data component utility functions
const editCustomer = (customer: any) => {
  showToast('info', 'Edit Customer', `Editing ${customer.name}`)
}

const deleteCustomer = (customer: any) => {
  confirm.require({
    message: `Are you sure you want to delete ${customer.name}?`,
    header: 'Delete Customer',
    icon: 'pi pi-exclamation-triangle',
    rejectProps: { label: 'Cancel', severity: 'secondary' },
    acceptProps: { label: 'Delete', severity: 'danger' },
    accept: () => {
      showToast('success', 'Customer Deleted', `${customer.name} has been deleted`)
    }
  })
}

const exportCSV = (event: any) => {
  showToast('info', 'Export', 'Data exported successfully')
}

const addToCart = (product: any) => {
  showToast('success', 'Product Added', `${product.name} added to cart`)
}

const addToWishlist = (product: any) => {
  showToast('info', 'Wishlist', `${product.name} added to wishlist`)
}

// Navigation utility functions
const toggleMenu = (event: any) => {
  menu.value.toggle(event)
}

const prevStep = () => {
  if (activeStep.value > 0) {
    activeStep.value--
  }
}

const nextStep = () => {
  if (activeStep.value < stepItems.value.length - 1) {
    activeStep.value++
  }
}

onMounted(() => {
  // Initialize progress animation
  const interval = setInterval(() => {
    progressValue.value = progressValue.value + Math.floor(Math.random() * 10) + 1
    if (progressValue.value >= 100) {
      progressValue.value = 0
    }
  }, 2000)
})
</script>

<style scoped>
.grid {
  display: grid;
}
.grid-cols-1 {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}
.grid-cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.grid-cols-3 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}
@media (min-width: 768px) {
  .md\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (min-width: 1024px) {
  .lg\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .lg\:grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>