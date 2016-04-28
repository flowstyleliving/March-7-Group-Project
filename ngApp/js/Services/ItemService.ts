namespace app.Services {
  interface IItemResource extends ng.resource.IResource<IItemResource>, app.i.IItem {}
  interface IItemClass extends ng.resource.IResourceClass<IItemResource> {
    update(params: Object, body: Object)
  };

  export class ItemService {
    private ItemResource: IItemClass;

    public getAll() {
      return this.ItemResource.query();
    }

    public getOne(id: string) {
      return this.ItemResource.get({id: id}).$promise;
    }

    public createItem(title, images, description, dateCompleted, projectURL, category) {
      return this.ItemResource.save({title: title, images: images, description: description, dateCompleted: dateCompleted, projectURL: projectURL, category: category }).$promise;
    }

    public update(item: app.i.IItem) {
      return this.ItemResource.update({id: item._id}, {title: item.title, images: item.images, description: item.description, dateCompleted: item.dateCompleted, category: item.category, projectURL: item.projectURL}).$promise;
    }

    public delete(id: string) {
      return this.ItemResource.remove({id: id}).$promise;
    }

    constructor(
      private $resource: ng.resource.IResourceService
    ) {this.ItemResource = <IItemClass>$resource('/api/v1/items/:id', null, {
        'update': { method: 'PUT'}
      });}
  };
  angular.module('app').service('ItemService', ItemService);
};
