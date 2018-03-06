/**
 * Created by golanm on 12/02/2018.
 */

import {Injectable} from "@angular/core";
import {AngularFireDatabase, AngularFireList} from "angularfire2/database";
import {AngularFireAuth} from "angularfire2/auth";
import * as firebase from 'firebase';
import {Message} from "../models/Message";
import {Observable} from "rxjs";
import {User} from "../models/User";


@Injectable()
export class FirebaseService {

	private firebaseUser: firebase.User;
	private authState: any;
	private messagesRef: AngularFireList<Message>;
	private messages: Observable<Message[]>;

	constructor(private db: AngularFireDatabase, private afAuth: AngularFireAuth) {
		// afAuth.authState.subscribe(auth => {
		// 	if (auth !== undefined && auth !== null) {
		// 		this.user = auth;
		// 	}
		// });

		// this.messagesRef = db.list('messages');
	}

	get currentUserId(): string {
		return this.authState !== null ? this.authState.uid : '';
	}

	signUp(user: User) {
		return this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.password)
			.then(fUser => {
				this.authState = fUser;
				this.setUserData(user);
			});
	}

	setUserData(user: User) {
		const path = `users/${this.currentUserId}`;
		const data = {'email': user.email, 'nickname': user.nickname};
		this.db.object(path).update(data)
			.catch(error => console.log(error));
	}

	login(user: User) {
		return this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password)
			.then(fUser => {
				this.authState = fUser;
			});
	}

	getLoggedInUser() {
		const userId = this.authState.uid;
		const path = `users/${userId}`;
		return this.db.object(path).valueChanges();
	}

	// sendMessage() {
	// 	this.messagesRef.push({
	// 		message: 'abcdefg'
	// 	});
	// }
	//
	// getMessages(): Observable<Message[]> {
	// 	return this.messagesRef.valueChanges();
	// }

}